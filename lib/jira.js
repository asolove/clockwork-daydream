var Promise = require('es6-promise').Promise;
var https = require('https');

var restFetch = function(username, password, path) {
    var options = {
        // TODO make configurable
        hostname: 'jira.freewebs.com',
        port: 443,
        path: '/rest' + path,
        auth: username + ':' + password
    };
    console.log('Requesting', options.path);
    return new Promise(function (resolve, reject) {
        https.get(options, function(response) {
            if (response.statusCode !== 200) {
                reject({ statusCode: response.statusCode });
            }

            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                try {
                    console.log('Received', options.path);
                    resolve(JSON.parse(body));
                } catch(err) {
                    console.error('Could not parse body as JSON.');
                    console.error(body);
                    reject(err);
                }
            });
        }).on('error', function(e) {
            reject(e);
        });
    });
};

var jiraFetch = function(username, password, path) {
    return restFetch(username, password, '/api/2/' + path);
};

var greenHopperFetch = function(username, password, path) {
    return restFetch(username, password, '/greenhopper/1.0/' + path);
};

module.exports = {
    streams: function(app) {
        var streamFieldId;
        jiraFetch(app.get('username'), app.get('password'), 'field').then(function(fields) {
            fields = fields.filter(function(field) {
                return field.name === 'Stream';
            });
            // should be only the one
            streamFieldId = fields[0].id;
            return jiraFetch(app.get('username'), app.get('password'), 'issue/FWB-1/editmeta');
        }).then(function(result) {
            var streamValues = result.fields[streamFieldId].allowedValues;
            streamValues = streamValues.map(function(value) {
                return { stream: value.value, id: value.id };
            });
            app.set('jira.streams', streamValues);
        }).catch(function(e) {
            console.error(e);
        });
    },

    views: function(app) {
        greenHopperFetch(app.get('username'), app.get('password'), 'rapidview').then(function(result) {
            var rapidViews = result.views.filter(function(view) {
                return view.sprintSupportEnabled;
            }).map(function(view) {
                return { id: view.id, name: view.name };
            });
            app.set('jira.views', rapidViews);
        }).catch(function(e) {
            console.error(e);
        });
    },

    sprints: function(app, id) {
        return greenHopperFetch(app.get('username'), app.get('password'), 'sprintquery/' + id);
    },

    sprint: function(app, viewId, sprintId) {
        return greenHopperFetch(app.get('username'), app.get('password'), 'rapid/charts/sprintreport?rapidViewId=' +
                viewId + '&sprintId=' + sprintId);
    }
};
