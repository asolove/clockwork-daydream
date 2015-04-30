var Promise = require('bluebird');
var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var read = require('read');
var jira = require('./lib/jira');

var app = express();

var asyncRead = Promise.promisify(read);

// set up express
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// routes
// default route
app.get('/', function(req, res) {
    res.render('home');
});

// spin up the server
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
            app.get('port') + '; press Ctrl-C to terminate.');
    // need to capture credentials, password is safest interactively
    asyncRead({ prompt:'Please enter your Jira username:' }).then(function(username) {
        // not sure why read or the promisified version returns an array
        app.set('username', username[0]);
        return asyncRead({ prompt:'Please enter your Jira password:', silent: true });
    }).then(function(password) {
        // not sure why read or the promisified version returns an array
        app.set('password', password[0]);

        app.set('streams', jira.streams(app.get('username'), app.get('password')));
        app.set('rapidviews', jira.rapidViews(app.get('username'), app.get('password')));
    });
});
