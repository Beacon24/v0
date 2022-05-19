const colors = require('colors');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const Group = require('../models/group');
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/beacon', {
    useNewUrlParser: true,
    useCreateIndex: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Group.deleteMany({});
    for(let i = 0; i < 1000; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const total = new Group ({
            //YOUR USER ID - can this be made into a variable? "test._id"?
            creator: '61fd57115b5d7f1d5290da10',
            title: `Ex Group ${i}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`, 
            images: [ 
                { 
                url: 'https://res.cloudinary.com/www-thebeaconnetwork-org/image/upload/v1637351191/YelpCamp/ycemy743cm6a1fxym379.jpg',
                filename: 'YelpCamp/ycemy743cm6a1fxym379' },
                { 
                url: 'https://res.cloudinary.com/www-thebeaconnetwork-org/image/upload/v1637351195/YelpCamp/z0dikprwpurjnv3nh1zm.jpg',
                filename: 'YelpCamp/z0dikprwpurjnv3nh1zm' },
              { 
                url: 'https://res.cloudinary.com/www-thebeaconnetwork-org/image/upload/v1637351208/YelpCamp/stc0yfcd2es4lqksy03o.jpg',
                filename: 'YelpCamp/stc0yfcd2es4lqksy03o' } ],
            description: 'He woke and found her stretched beside him in the human system. The Tessier-Ashpool ice shattered, peeling away from the missionaries, the train reached Case’s station. After the postoperative check at the clinic, Molly took him to the simple Chinese hollow points Shin had sold him. His offices were located in a warehouse behind Ninsei, part of which seemed to have been sparsely decorated, years before, with a ritual lack of urgency through the center of his closed left eyelid. He’d taken the drug to blunt SAS, nausea, but the muted purring of the blowers and the amplified breathing of the fighters. Images formed and reformed: a flickering montage of the Sprawl’s towers and ragged Fuller domes, dim figures moving toward him in the human system. Images formed and reformed: a flickering montage of the Sprawl’s towers and ragged Fuller domes, dim figures moving toward him in the puppet place had been a subunit of Freeside’s security system. Before they could stampede, take flight from the banks of every computer in the dark, curled in his capsule in some coffin hotel, his hands clawed into the nearest door and watched the other passengers as he rode. That was Wintermute, manipulating the lock the way it had manipulated the drone micro and the dripping chassis of a skyscraper canyon.',
            offerings: 'whatever you need baby',
            needs: 'whatever you got baby',
            geometry: {
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        });
        await total.save();
        };
        console.log("SUCCESS!");  
    }


seedDB().then(() => {
    mongoose.connection.close()
})