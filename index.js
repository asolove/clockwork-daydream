var fs = require('fs');
var https = require('https');
var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var path = require('path');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// set up express
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
    secret: '+AMfK6F3X/+UQQjLyUXYoha61H2rycAIntOhrBnd26zFs+WiGyyh2VG8xC1Agpfa8dBg/6yrzSxKGccBvsjdOg==',
    resave: false,
    saveUninitialized: false
}));
app.use(require('body-parser').json());

// routes
// default route
app.get('/', function(req, res) {
    res.render('home');
});
app.get('/views', routes.views);
app.get('/sprints/:id', routes.sprints);
app.get('/sprint/:viewId/:sprintId', routes.sprint);
app.post('/login', routes.login);

// load ssl credentials
var keyFile = process.env.KEY_FILE || 'sslcert/key.pem';
var privateKey = fs.readFileSync(keyFile, 'utf8');
var certFile = process.env.KEY_FILE || 'sslcert/cert.pem';
var certificate = fs.readFileSync(certFile, 'utf8');
var credentials = { key: privateKey, cert: certificate };

// spin up the server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
            app.get('port') + '; press Ctrl-C to terminate.');
});
