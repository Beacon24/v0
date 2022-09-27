const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const User = require('../models/user');
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { userSchema } = require('../schemas.js');
const { isLoggedIn, isCreator, isUser, validateUser } = require('../middleware')


router.route('/register')
    .get(users.renderRegister)
    .post(upload.array('image'), catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login'}), users.login)

router.route('/')
    .get(isLoggedIn, catchAsync(users.index))

router.get('/logout', users.logout)

router.route('/index', isLoggedIn)

router.route('/:id')
    .get(isLoggedIn, catchAsync(users.showUser))
    .get(isLoggedIn, catchAsync(users.currentUser))
    .put(isLoggedIn, isUser, upload.array('image'), catchAsync(users.updateUser))
    .delete(isLoggedIn, isUser, catchAsync(users.deleteUser))

router.get('/:id/edit', isLoggedIn, isUser, catchAsync(users.renderEditForm))



module.exports = router; 
