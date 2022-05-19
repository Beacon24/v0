const express = require('express');
const router = express.Router();
const groups = require('../controllers/groups')
const initiatives = require('../controllers/initiatives')
const users = require('../controllers/users')
const explore = require('../controllers/explore')
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
// const methodOverride = require('method-override');
const Group = require('../models/group');
const { isLoggedIn, isCreator, validateGroup } = require('../middleware')
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const { groupSchema } = require('../schemas.js');

router.route('/') 
    .get(catchAsync(explore.index))

module.exports = router;