const express = require('express');
const router = express.Router();
const give = require('../controllers/give')
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
// const methodOverride = require('method-override');

router.route('/') 
    .get(catchAsync(give.index))