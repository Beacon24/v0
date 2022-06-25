if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}



const colors = require('colors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate'); 
const joi = require('joi');
const flash = require('connect-flash')
const ExpressError = require('./util/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

const morgan = require('morgan');

const MongoDBStore = require("connect-mongo")(session);

const userRoutes = require('./routes/users')
const groupRoutes = require('./routes/groups');
const initiativeRoutes = require('./routes/initiatives')
const exploreRoutes = require('./routes/explore')

const { places, descriptors } = require('./seeds/seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/beacon';
// 'mongodb://localhost:27017/beacon'
// process.env.DB_URL

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected".blue);
});

const app = express();

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'badsecret'

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'colt@gmail.com', username: 'colt' })
//     const newUser = await User.register(user, 'kitty');
//     res.send(newUser);
// })

app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/initiatives', initiativeRoutes)
app.use('/explore', exploreRoutes)

// app.use(morgan('tiny'));

app.get('/',(req, res) =>{
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no! Something went wrong!';
    console.log('????',err);
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('BEACON LIT ON PORT 3000'.rainbow)
})

