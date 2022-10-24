
const Group = require('../models/group');
const Call = require('../models/call')

module.exports.createCall = async (req, res) => {
    console.log("req.params");
    console.log(req.params);
    const group = await Group.findById(req.params.id);
    const call = new Call(req.body.call);
    console.log("call")
    console.log(call)
    call.creator = req.user._id;
    group.calls.push(call);
    await call.save();
    await group.save();
    req.flash('success', 'YOU CREATED AN INITIATIVE!')
    res.redirect(`/groups/${group._id}`);
}

// module.exports.addLink = async (req, res) => {
//     const call = await Call.findById(req.params.id)
//     const link = new Link
// }

module.exports.deleteCall = async (req, res)=>{
    const { id, callId } = req.params;
    console.log(req.params)
    await Group.findByIdAndUpdate(id, { $pull: {calls: callId } })
    await Call.findByIdAndDelete(req.params.callId);
    req.flash('success', 'Succesfully removed!')
    res.redirect(`/groups/${id}`)
}

module.exports.renderEditForm = async (req, res) => {
    const { id, callId } = req.params;
    console.log("req.params");
    console.log(req.params);

    const call = await Call.findById(callId);
    const group = await Group.findById(id);
    if(!call){
        req.flash('error', 'call missing... :(');
        return res.redirect('/calls')
    } 
    res.render('calls/edit', { call, group })
}

module.exports.updateCall = async (req, res) => {
    const { id } = req.params;
    const call = await Call.findByIdAndUpdate(id, { ...req.body.call })
    await call.save();
    req.flash('success', 'Succesfully updated call!')
    res.redirect(`/groups/`)
}