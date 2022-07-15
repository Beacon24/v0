const Group = require('../models/group');
const Initiative = require('../models/initiative');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")


module.exports.index = async (req, res) => {
    const initiatives = await Initiative.find({});
    res.render('initiatives/index', { initiatives })
}

module.exports.renderNewInit = (req, res) => {
    res.render('initiatives/new')
}

module.exports.createInitiative = async (req, res, next) => {
    const initiative = new Initiative(req.body.initiative);
    const geoData = await geocoder.forwardGeocode({
        query: initiative.location,
        limit: 1
    }).send()
    geoData.body.features[0].geometry.coordinates
    initiative.geometry = geoData.body.features[0].geometry;
    initiative.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    initiative.creator = req.user._id;
    initiative.leaders.push(req.user._id)
    initiative.supporters.push(req.user._id)
    await initiative.save();
    req.flash('success', 'YOU CREATED AN INITIATIVE!')
    res.redirect(`/initiatives/${initiative._id}`);
}

module.exports.showInitiative = async (req, res) => {
    const initiative = await Initiative.findById(req.params.id)
    .populate({
        path:'groups',
        populate: {
            path: 'title'
        }
    })
    .populate('creator')
    // .populate({
    //     path: 'supporters',
    //     populate: {
    //         path: 'username'
    //     }
    // });
    if(!initiative){
        req.flash('error', 'Initiative not found.');
        return res.redirect('/initiatives')
    }
    res.render('initiatives/show', { initiative })
}

module.exports.renderEditInit = async (req, res) => {
    const { id } = req.params;
    const initiative = await Initiative.findById(id);
    if(!initiative){
        req.flash('error', 'initiative missing... :(');
        return res.redirect('/initiatives')
    } 
    res.render('initiatives/edit', { initiative })
}

module.exports.updateInitiative = async (req, res) => {
    const { id } = req.params;
    const initiative = await Initiative.findByIdAndUpdate(id, { ...req.body.initiative })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    initiative.images.push(...imgs);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.initiative.location,
        limit: 1
    }).send()
    geoData.body.features[0].geometry.coordinates;
    initiative.geometry = geoData.body.features[0].geometry;
    await initiative.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await initiative.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Succesfully updated initiative!')
    res.redirect(`/initiatives/${initiative._id}`)
}

module.exports.supportInitiative = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const initiative = await Initiative.findById(id);
    initiative.supporters.addToSet(user);
    user.initiatives.addToSet(initiative);
    await initiative.save();
    await user.save();
    req.flash('success', 'JOINED initiative!');
    res.redirect(`/initiatives/${initiative._id}`);
}

module.exports.deleteInitiative = async (req, res)=>{
    const { id } = req.params;
    const initiative = await Initiative.findById(id);
    if(!initiative.creator.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/initiatives/${id}`);
    } else {
        await Initiative.findByIdAndDelete(req.params.id);
    }
    req.flash('success', 'Succesfully deleted initiative!')
    res.redirect('/initiatives');
}


// this was old code maybe from when inits were extensions of groups, like comments in yelpcamp
// const { id, initiativeId } = req.params;
// await Group.findByIdAndUpdate(id, { $pull: {initiatives: initiativeId } })
// await Initiative.findByIdAndDelete(req.params.initiativeId);
// req.flash('success', 'Succesfully removed!')
// res.redirect(`/initiatives`)