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
    console.log("test~~~")
    console.log(req.body.keywords)
    const keywords = req.body.keywords
    const groups = db.initiatives.aggregate([
        {
            $search: {
                index: 'firstInitiatives',
                compound:{
                    "should":[
                        {    
                            "autocomplete": {
                                query: keywords,
                                path: 'title'
                            }
                              
                        },
                        {
                            "text": {
                                query: keywords,
                                path: 'summary'
                            }
                        }
                    ]
                }
            }
        },{
             $project: {_id:0, title:1}
        }
    
    ])
    //something here to conditionally run $and/$or search?
        //const groups = await Group.find({$or: [{title: keywords}, {description: keywords}]})
    // const initiatives = await Initiative.find({$or: [{title: keywords}, {description: keywords}, {summary: keywords}]})    
    // const users = await User.find({bio: keywords})
    console.log("groups result:")
    console.log(groups)
    // res.render('explore/results', { groups })
}
