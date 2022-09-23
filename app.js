let express = require('express')


let app = express()
app.use(express.static(__dirname + '/public'))
let handlebars = require('express-handlebars')
    .create({defaultLayout:'main'})
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 3000)

app.get('/', function (req, res) {
    res.render('home')
})
app.get('/about', function (req, res) {
    res.render('about')
})

app.use(function(req, res, next){
    res.status(404)
    res.render('404')
})

app.use(function( req, res, next, err){
    console.error(err.stack)
    res.status(500)
    res.render('500')
})



app.listen(app.get('port'), function () {
    console.log('Express запущен на localhost:' + app.get('port'));
})