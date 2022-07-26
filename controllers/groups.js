const Group = require('../models/group')

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")



module.exports.index = async (req, res) => {
    const groups = await Group.find({});
    res.render('groups/index', { groups })   
}

module.exports.renderNewForm = (req, res) => {
    res.render('groups/new')
}

module.exports.createGroup = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Group Data', 400);
        const geoData = await geocoder.forwardGeocode({
            query: req.body.group.location,
            limit: 1
        }).send()
        geoData.body.features[0].geometry.coordinates
        const group = new Group(req.body.group);
        group.geometry = geoData.body.features[0].geometry;
        group.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        group.creator = req.user._id;
        await group.save();     
        req.flash('success', 'You added a group to the database! Great job! OK!')
        res.redirect(`/groups/${group._id}`)
}


module.exports.showGroup = async (req, res) => {
    const group = await Group.findById(req.params.id)
    .populate({ 
        path: 'initiatives',
        populate: {
            path: 'creator'
        }
    })
    .populate('creator')
    .populate({
        path: 'members',
        populate: {
            path: 'user'
        }
    });
    if(!group){
        req.flash('error', 'group missing... :(');
        return res.redirect('/groups')
    }
    res.render('groups/show', { group })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    if(!group){
        req.flash('error', 'group missing... :(');
        return res.redirect('/groups')
    } 
    res.render('groups/edit', { group })
}


module.exports.updateGroup = async (req, res) => {
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(id, { ...req.body.group })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    group.images.push(...imgs);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.group.location,
        limit: 1
    }).send()
    geoData.body.features[0].geometry.coordinates;
    group.geometry = geoData.body.features[0].geometry;
    await group.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await group.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Succesfully updated group!')
    res.redirect(`/groups/${group._id}`)
}


module.exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    if(!group.creator.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/groups/${id}`);
    } else {
        await Group.findByIdAndDelete(req.params.id);
    }
    req.flash('success', 'Succesfully deleted group!')
    res.redirect('/groups');
}

module.exports.joinGroup = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const group = await Group.findById(id);
    group.members.addToSet(user);
    user.groups.addToSet(group);
    await group.save();
    await user.save();
    req.flash('success', 'JOINED GROUP!');
    res.redirect(`/groups/${group._id}`);
}

module.exports.leaveGroup = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const group = await Group.findById(id);
    console.log("group");
    console.log(group)
    group.updateOne(
        { $pull: { members: user} }
    );
    user.updateOne(
        { $pull: { groups: group} }
    );
    console.log("group after");
    console.log(group);
    await group.save();
    await user.save();
    req.flash('success', 'Left group!');
    res.redirect(`/groups/${group._id}`);
}

//CHECK FIRST IF USER IS ALREADY IN GROUP
// module.exports.createInitiative = async (req, res) => {
//     //if clause
//     const group = await Group.findById(req.params.id);
//     const initiative = new Initiative(req.body.initiative);
//     initiative.creator = req.user._id;
//     group.initiatives.push(initiative);
//     await initiative.save();
//     await group.save();
//     req.flash('success', 'YOU CREATED AN INITIATIVE!')
//     res.redirect(`/groups/${group._id}`);
// }

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}


// SEARCH DRAFTS
// module.exports.groupSearch = async (req, res) => {
//     const groups = await Group.find({
//         title: {$in: searchQuery.title}
//     })
// }