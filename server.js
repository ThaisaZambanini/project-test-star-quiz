var express = require('express')
var expressLayouts = require('express-ejs-layouts')
var app = express()
var cors = require('cors');

app.use(cors())

var port = 3000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

app.use(expressLayouts)

app.get('/', (req, res) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.render('pages/home')
})

app.get('/game', (req, res) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.render('pages/game')
})

app.use(express.static(__dirname + '/build'))

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
