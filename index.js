var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var Promise = require('es6-promise').Promise;
var path = require('path');
var read = require('read');
var jira = require('./lib/jira');
var routes = require('./routes/index');

var app = express();

var asyncRead = function(options) {
    return new Promise(function (resolve, reject) {
        read(options, function(err, result) {
            if (err !== null) reject(err);
            resolve(result);
        });
    });
};

// set up express
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// routes
// default route
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/views', routes.views);
app.get('/sprints/:id', routes.sprints);
app.get('/sprint/:viewId/:sprintId', routes.sprint);

// spin up the server
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
            app.get('port') + '; press Ctrl-C to terminate.');

    // need to capture credentials, password is safest interactively
    asyncRead({ prompt:'Please enter your Jira username:' }).then(function(username) {
        // not sure why read or the promisified version returns an array
        app.set('username', username);
        return asyncRead({ prompt:'Please enter your Jira password:', silent: true });
    }).then(function(password) {
        // not sure why read or the promisified version returns an array
        app.set('password', password);

        jira.streams(app);
        jira.views(app);
    });
});
