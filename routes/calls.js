const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const Group = require('../models/group');
const Call = require('../models/call');
const calls = require('../controllers/calls')



// const { isLoggedIn, validateCall, isCallCreator } = require('../middleware')

router.post('/', catchAsync(calls.createCall))
//validateCall, isLoggedIn,

router.delete('/:callId', catchAsync(calls.deleteCall))
//, isLoggedIn, isCallCreator

router.get('/:callId/edit', catchAsync(calls.renderEditForm))

router.put('/:id', catchAsync(calls.updateCall))



module.exports = router;