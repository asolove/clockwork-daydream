var express = require('express');
var transitions = require('./transitions');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/transitions/dwell', transitions.dwell);

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
            app.get('port') + '; press Ctrl-C to terminate.');
});
