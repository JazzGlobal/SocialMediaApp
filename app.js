var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
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
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home')
});


// AUTH ROUTES

app.get('/login', (req, res) => {
    return res.render('login')
});

app.get('/signup', (req, res) => {
    if(req.user == null){
        return res.render('register');
    } else {res.redirect('/')}
});

app.post('/signup', (req, res) => {
    var newUser = new User({username: req.body.username});
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