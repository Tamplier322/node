let express = require('express')
let fortune = require('./lib/fortune.js')
let app = express()
app.disable('x-powered-by');

function getWeatherData(){
    return{
        locations: [
            {
                name: 'Портленд',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Сплошная облачность',
                teml: '12.3 C',
            },
            {
                name: 'Бенд',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Малооблачно',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Манзанита',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Небольшой дождь',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData()
    next()
})



let tours = [
    { id: 0, name: 'Река Худ', price: 99.99 },
    { id: 1, name: 'Орегон Коуст', price: 149.95 },
];

app.get('/api/tours', function(req, res){
    res.json(tours);
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

app.use(function (req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1'
    next()
})

app.use(express.static(__dirname + '/public'))
let handlebars = require('express-handlebars')
    .create({defaultLayout:'main'})
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

//ставим порт 3000
app.set('port', process.env.PORT || 3000)

//выдает главную страницу
app.get('/', function (req, res) {
    res.render('home')
})
//выдает страницу about
app.get("/about", function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    } );
})

//headers http запроса
// app.get('/headers', function(req,res){
//     res.set('Content-Type','text/plain');
//     var s = '';
//     for(var name in req.headers)
//         s += name + ': ' + req.headers[name] + '\n';
//     res.send(s);
// })
//страница ошибки 404
app.use(function(req, res, next){
    res.status(404)
    res.render('404')
})
//страница ошибки 500
app.use(function( req, res, next, err){
    console.error(err.stack)
    res.status(500)
    res.render('500')
})


app.listen(app.get('port'), function () {
    console.log('Express запущен на localhost:' + app.get('port'));
})