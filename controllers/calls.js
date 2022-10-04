
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

module.exports.deleteCall = async (req, res)=>{
    const { id, callId } = req.params;
    await Group.findByIdAndUpdate(id, { $pull: {calls: callId } })
    await Call.findByIdAndDelete(req.params.callId);
    req.flash('success', 'Succesfully removed!')
    res.redirect(`/groups/${id}`)
}