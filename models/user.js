const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: String,
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
    location: String,
    interests: String,
    offerings: String,
    needs: String,
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    initiatives: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Initiative'
        }
    ]
}, opts);

UserSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/users/${this._id}">${this.username}</a></strong>
    <p>${this.bio.substring(0,100)}...</p>
    `;
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema); 