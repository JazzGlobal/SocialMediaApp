var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    app = express()

app.get('/', (req, res) => {
    res.redirect('/home');
})

app.get('/home', (req, res) => {
    res.render('home.ejs')
});

try {
    var PORT = env.PORT
} catch (exception){
    PORT = 3000
}

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})