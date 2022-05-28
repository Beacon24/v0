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

module.exports.search = async (req, res) => {
    const keywords = [req.params]
    const groups = await Group.find({$or: [{title: keywords}, {description: keywords}]})
    //something here to conditionally run $and/$or search?
    const initatives = await Initative.find({$or: [{title: keywords}, {description: keywords}, {summary: keywords}]})    
    const users = await User.find({bio: keywords})
    res.render('explore/results', { groups, initiatives, users })
}