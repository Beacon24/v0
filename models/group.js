const mongoose = require('mongoose');
const Initiative = require('./initiative');
const Schema = mongoose.Schema;
// https://res.cloudinary.com/www-thebeaconnetwork-org/image/upload/w_300/v1637381620/YelpCamp/zrm6rpwc76z9kpwhjetr.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String,
    //add type field
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const GroupSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    offerings: {
        type: String
    },
    needs: {
        type: String
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    initiatives: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Initiative'
        }
    ]
}, opts);

GroupSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/groups/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,100)}...</p>
    `;
});

// GroupSchema.post('findOneAndDelete', async function (doc) {
//     if(doc){
//         await Initiative.remove({
//             _id: {
//                 $in: doc.initiatives
//             }
//         })
//     }
// }) THIS MAY BE OLD FROM WHEN INITS WERE EXTENSIONS OF GROUPS

module.exports = mongoose.model('Group', GroupSchema,);
