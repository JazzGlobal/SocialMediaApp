var express = require('express'),
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