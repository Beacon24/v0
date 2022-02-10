const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');

const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const Initiative = require('../models/initiative');
const initiatives = require('../controllers/initiatives');
const { InitiativeSchema } = require('../schemas.js')

const { isLoggedIn, validateInitiative, isInitiativeCreator } = require('../middleware')

router.route('/')
    .get(catchAsync(initiatives.index))
    .post(isLoggedIn, catchAsync(initiatives.createInitiative))

router.get('/new', isLoggedIn, initiatives.renderNewInit)

router.route('/:id')
    .get(catchAsync(initiatives.showInitiative))
    .put(isLoggedIn, catchAsync(initiatives.updateInitiative))
    .delete(isLoggedIn, catchAsync(initiatives.deleteInitiative))

router.get('/:id/edit', isLoggedIn, catchAsync(initiatives.renderEditInit))

router.delete('/:initiativeId', isLoggedIn, isInitiativeCreator, catchAsync(initiatives.deleteInitiative))

module.exports = router;
