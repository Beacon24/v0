const Group = require('../models/group')
const Initiative = require('../models/initiative')
const User = require('../models/user')

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
    const groups = await Group.find({});
    const initiatives = await Initiative.find({});
    const users = await User.find({});
    res.render('explore/index', { groups, initiatives, users })   
}