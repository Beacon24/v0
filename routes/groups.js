const express = require('express');
const router = express.Router();
const groups = require('../controllers/groups')
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
    .get(isLoggedIn, catchAsync(groups.index))
    .post(isLoggedIn, upload.array('image'), validateGroup, catchAsync(groups.createGroup))

router.get('/new', isLoggedIn, groups.renderNewForm)



router.route('/:id')
    .get(catchAsync(groups.showGroup))
    .put(isLoggedIn, isCreator, upload.array('image'), catchAsync(groups.updateGroup))
    .delete(isLoggedIn, isCreator, catchAsync(groups.deleteGroup))


router.post('/:id/join', isLoggedIn, catchAsync(groups.joinGroup))
router.delete('/:id/leave', isLoggedIn, catchAsync(groups.leaveGroup))

router.get('/:id/edit', isLoggedIn, isCreator, catchAsync(groups.renderEditForm))



module.exports = router;