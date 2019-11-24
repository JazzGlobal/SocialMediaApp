// TODO: Need to create a way to pass the index of the fweet that is to be replied to to the reply route. 
//       This allows us the post to the correct fweet. Because of the implementation of the fweets (Inside the user object),
//       it is impossible to query the database for a unique fweet by _id. 
//      
//       Write an API file that queries the user (Fweet.owner returns the user id of the poster), and then query then iterate over the fweets object inside the user,
//       Then match by the fweet ID. Return the fweet index. 

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Fweet = require('./models/fweet'),
    app = express()

// MONGOOSE CONFIG
// mongoose.connect(process.env.MONGOD_URI || 'mongodb+srv://jazzglobal:Coolkids1478!@cluster0-cvxgu.mongodb.net/social_media_app?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect('mongodb://localhost:27017/fwitter', {useNewUrlParser: true, useUnifiedTopology: true})
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


//======
//START OF HOME ROUTES
//======
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home', {user: req.user});
});
//======
//END OF HOME ROUTES
//======


//======
//START OF LOGGED_IN_PROFILE ROUTES
//======
app.get('/profile', (req, res) => {
    res.redirect('/profile/1')
});

app.get('/profile/:pageNumber', (req, res) => {
    if(req.user != null){
        console.log(req.user);
        User.findById(req.user._id, (err, foundUser) => {
            if(err){
                console.log(err);
                res.redirect('/');
            } else { res.render('logged_in_profile', {user: foundUser, currentPage: req.params.pageNumber});}
        });
    } else { res.redirect('/login') }
});
//======
//END OF LOGGED_IN_PROFILE ROUTES
//======


//======
//START OF EDIT_SETTINGS ROUTES
//======

app.get('/edit', (req, res) =>{
    if(req.user != null){
        res.render('edit_settings', {user: req.user})
    } else {res.redirect('/')}
});

app.post('/edit', (req, res) => {
    if(req.user != null){
        var userName = req.body.username;
        var name = req.body.name;
        var biography = req.body.biography;
        User.findByIdAndUpdate(req.user._id, {username: userName, name: name, biography: biography}, (err, foundUser) =>{
            if(err){
                console.log(err);
                res.redirect('/');
            } else {
                foundUser.save((err) =>{
                    if(err){
                        console.log(err);
                    }else {
                        req.logIn(req.user, function(err){
                            if(err){
                                console6.log(err)
                            } else {
                                res.redirect('/profile');
                            }
                        })
                    }
                })
            }
        });
    } else {res.redirect('/')}
});

//======
//END OF EDIT_SETTINGS ROUTES
//======

//======
//START OF SEARCH FOR USER ROUTES
//======
app.get('/user', (req, res) => {
    var username = req.query.username;
    res.redirect(`/user/${username}`);
});

app.get('/user/:username', (req, res) => {
    res.redirect(`/user/${req.params.username}/1`);   
});

app.get('/user/:username/:pageNumber', (req, res) => {
    if(req.user != null) {
        User.findOne({username: req.params.username}, (err, foundUser) => {
            if(err || foundUser == null){
                console.log(err);
                res.redirect('/');
            } else {
                console.log(foundUser)
                res.render('view_user', {user: foundUser, currentPage: req.params.pageNumber});
            }
        })
    } else {res.redirect('/')}
});
//======
//END OF SEARCH FOR USER ROUTES
//======

//======
//START OF FWEET ROUTES
//======
app.get('/fweet', (req, res) => {
    res.render('fweet');
});

app.post('/fweet', (req, res) => {
    // Add fweet to current logged in users list of fweets 
    var newFweet = Fweet({subject: req.body.subject, message: req.body.message, owner: req.user._id});
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

//======
//END OF FWEET ROUTES
//======

//======
//START OF AUTH ROUTES
//======
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    if(req.user == null){
        return res.render('login');
    } else {res.redirect('/profile')}
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
//======
//END OF AUTH ROUTES
//======


try {
    var PORT = env.PORT
} catch (exception){
    PORT = 3000
}

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`)
})