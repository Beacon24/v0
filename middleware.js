const { groupSchema, initiativeSchema, userSchema } = require('./schemas.js');
const ExpressError = require('./util/ExpressError')
const Group = require('./models/group');
const User = require('./models/user')
const Initiative = require('./models/initiative')

module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to view this page.')
        return res.redirect('/users/login')
    }
    next();
}

module.exports.validateGroup = (req, res, next) => {
    const { error } = groupSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isUser = async(req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/users/${id}`);
    }
    next();
} 

module.exports.isCreator = async(req, res, next) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    if(!group.creator.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/groups/${id}`);
    }
    next();
}

// module.exports.isMember = async(req, res, next) => {
//     const { id } = req.params;
//     const group = await Group.findById(id);
//     console.log("middleware group members");
//     console.log(group.members);
//     console.log("middleware user id");
//     console.log(req.user._id);
//     // if(group.members.includes(req.user._id)){
//         // req.flash('error', 'You already belong to this group!!');
//         // return res.redirect(`/groups/${id}`);
//     // } 
//     next();
// }

module.exports.isInitiativeCreator = async(req, res, next) => {
    const { id, initiativeId } = req.params;
    const initiative = await Initiative.findById(initiativeId);
    if(!initiative.creator.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/groups/${id}`);
    }
    next();
}

module.exports.validateInitiative = (req, res, next) => {
    const { error } = initiativeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}