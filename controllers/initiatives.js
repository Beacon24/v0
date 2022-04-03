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
    //const group = await Group.findById(req.params.id);
    console.log('---------------req.body');
    console.log(req.body);
    const initiative = new Initiative(req.body.initiative);
    // const geoData = await geocoder.forwardGeocode({
    //     query: initiative.location,
    //     limit: 1
    // }).send()
    // geoData.body.features[0].geometry.coordinates
    // initiative.geometry = geoData.body.features[0].geometry;
    console.log('initiative')
    console.log(initiative)
    initiative.creator = req.user._id;
    //group.initiatives.push(initiative);
    await initiative.save();
    req.flash('success', 'YOU CREATED AN INITIATIVE!')
    res.redirect(`/initiatives/${initiative._id}`);
}

module.exports.showInitiative = async (req, res) => {
    const initiative = await Initiative.findById(req.params.id)
    // .populate({
    //     path:'groups',
    //     populate: {
    //         path: 'title'
    //     }
    // })
    // .populate('creator')
    // .populate({
    //     path: 'supporters',
    //     populate: {
    //         path: 'user'
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
    res.render('groups/edit', { group })
}

module.exports.updateInitiative = async (req, res) => {
    const { id } = req.params;
    const initiative = await Initiative.findByIdAndUpdate(id, { ...req.body.initiative })
    const geoData = await geocoder.forwardGeocode({
        query: req.body.initiative.location,
        limit: 1
    }).send()
    geoData.body.features[0].geometry.coordinates;
    initiative.geometry = geoData.body.features[0].geometry;
    await initiative.save();
    req.flash('success', 'Succesfully updated initiative!')
    res.redirect(`/groups/${group._id}`)
}

module.exports.deleteInitiative = async (req, res)=>{
    const { id, initiativeId } = req.params;
    await Group.findByIdAndUpdate(id, { $pull: {initiatives: initiativeId } })
    await Initiative.findByIdAndDelete(req.params.initiativeId);
    req.flash('success', 'Succesfully removed!')
    res.redirect(`/groups/${id}`)
}