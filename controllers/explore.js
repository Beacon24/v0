const Group = require('../models/group')
const Initiative = require('../models/initiative')
const User = require('../models/user')

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async (req, res) => {
    const groups = await Group.find({});
    const initiatives = await Initiative.find({});
    const users = await User.find({});
    res.render('explore/index', { groups, initiatives, users })   
}

module.exports.search = async (req, res) => {
    console.log("req.params")
    console.log(req.params)
    const keywords = req.params
    console.log(keywords)
    const groups = await Group.find({$or: [{title: keywords}, {description: keywords}]})
    //something here to conditionally run $and/$or search?
    const initiatives = await Initiative.find({$or: [{title: keywords}, {description: keywords}, {summary: keywords}]})    
    const users = await User.find({bio: keywords})
    res.render('explore/results', { groups, initiatives, users })
}
