const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InitiativeSchema = new Schema({
    title: String,
    summary: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
    location: String,
    when: String,
    description: String,
    needs: String,
    offerings: String,
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],

});

module.exports = mongoose.model('Initiative', InitiativeSchema);