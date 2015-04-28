var Promise = require('bluebird');
var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var transitions = require('./transitions');
var read = require('read');

var app = express();

var asyncRead = Promise.promisify(read);

// gather Jira credentials, hopefully somewhat securely
asyncRead({ prompt:'Please enter your Jira username:' }).then(function(username) {
    app.set('username', username);
    return asyncRead({ prompt:'Please enter your Jira password:', silent: true });
}).then(function(password) {
    app.set('password', password);
    // set up express
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');
    app.set('port', process.env.PORT || 3000);
    app.use(express.static(__dirname + '/public'));

    // routes
    // TODO move these to their own files, in routes
    // TODO us fs to load and use routes
    // default route
    app.get('/', function(req, res) {
        res.render('home');
    });

    // report on dwell time
    // TODO think about renaming
    app.get('/transitions/dwell', transitions.dwell);

    // spin up the server
    app.listen(app.get('port'), function() {
        console.log('Express started on http://localhost:' +
                app.get('port') + '; press Ctrl-C to terminate.');
    });
});


