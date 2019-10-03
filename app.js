var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Fweet = require('./models/fweet'),
    app = express()

// MONGOOSE CONFIG
mongoose.connect(process.env.MONGOD_URI || 'mongodb+srv://jazzglobal:Coolkids1478!@cluster0-cvxgu.mongodb.net/social_media_app?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

//PASSPORT CONFIG
passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser((obj,done)=>{
    done(null,obj);
});

app.use(require("express-session")({
    secret: 'i am root',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home', {user: req.user});
});

app.get('/profile', (req, res) => {
    res.redirect('/profile/1')
});

app.get('/profile/:pageNumber', (req, res) => {
    if(req.user != null){
        console.log(req.user);
        res.render('logged_in_profile', {user: req.user, currentPage: req.params.pageNumber});
    } else { res.redirect('/login') }
});

// TODO: Convert logged_in_profile's card to partial
// TODO: Implement tweeting (back-end)
// TODO: Implement profile browsing (back-end)

//TEST ROUTES

app.get('/fweet', (req, res) => {
    res.render('fweet');
});

app.post('/fweet', (req, res) => {
    // Add fweet to current logged in users list of fweets 
    var newFweet = Fweet({subject: req.body.subject, message: req.body.message});
    User.findById(req.user._id, function(err, foundUser) {
        if(err){
            console.log(err);
            res.redirect('/logout');
        } else {
            console.log(newFweet);
            console.log(req.user);
            foundUser.fweets.push(newFweet);
            foundUser.save();
        }
    });
    res.redirect('/profile');
});

// AUTH ROUTES

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    return res.render('login');
});


app.post('/login', passport.authenticate('local',{successRedirect: "/", failureRedirect: "/failed"}),
  function(req, res, next){
});


app.get('/signup', (req, res) => {
    if(req.user == null){
        return res.render('register');
    } else {res.redirect('/')}
});

app.post('/signup', (req, res) => {
    var newUser = new User({username: req.body.username, name: req.body.name});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, ()=> {
            res.redirect('/');
        });
    });
});

try {
    var PORT = env.PORT
} catch (exception){
    PORT = 3000
}

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`)
})