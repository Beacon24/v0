const User = require('../models/user');
const passport = require('passport');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        //i dont think im declaring these consts in a good way, why cant i use req.body.user?
        const { email, username, password, name, location, bio, interests, offerings, needs, geometry, images } = req.body;
        const user = new User({ email, username, name, location, bio, interests, offerings, needs, geometry, images });
        user.images = req.files.map(f => ({ url: f.path, filename: f.filename }))       
        const geoData = await geocoder.forwardGeocode({
            query: user.location,
            limit: 1
        }).send()
        geoData.body.features[0].geometry.coordinates;
        user.geometry = geoData.body.features[0].geometry;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next (err);
            req.flash('success', "Welcome to Beacon!");
            res.redirect('/users')
        })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }   
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    // this should be res.redirect('redirectUrl') but for some reason broke when I extended registration/login into its own user routes.
    res.redirect(redirectUrl)
}

module.exports.index = async (req, res) => {
    const users = await User.find({})
    .populate({
        path: 'groups',
        populate: {
            path: 'group',
            populate: 'title'
        }
    })
    .populate({
        path: 'initiatives',
        populate: {
            path: 'initiative',
            populate: 'title'
        }
    });
    res.render('users/index', { users })
}

module.exports.showUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    .populate({
        path: 'groups',
        populate: {
            path: 'group'
        }
    })
    .populate({
        path: 'initiatives',
        populate: {
            path: 'initiative'
        }
    });
    res.render('users/show', { user })
}

module.exports.currentUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    .populate({
        path: 'groups',
        populate: {
            path: 'group'
        }
    })
    .populate({
        path: 'initiatives',
        populate: {
            path: 'initiative'
        }
    });
    res.render('users/current', { user })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user){
        req.flash('error', 'user missing... :(');
        return res.redirect('/users')
    } 
    res.render('users/edit', { user })
}

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    user.images.push(...imgs);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.user.location,
        limit: 1
    }).send()
    geoData.body.features[0].geometry.coordinates;
    user.geometry = geoData.body.features[0].geometry;
    await user.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await user.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Changes made succesfully!')
    res.redirect(`/users/${user._id}`)
}
//first attempt at users joining groups
// module.exports.joinGroup = async (req, res) => {
//     const group = await Group.findById(req.params.id);
//     const user = await User.findById(req.params.id);
//     group.members.push(user);
//     user.groups.push(group);
//     await group.save();
//     await user.save();
//     req.flash('success', 'YOU JOINED A GROUP!')
//     res.redirect(`/groups/${group._id}`);
// }

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

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/users/${id}`);
    } else {
        await User.findByIdAndDelete(req.params.id);
    }
    req.flash('success', 'Succesfully deleted user!')
    res.redirect('/users');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'see you soon!')
    res.redirect('/')
}

