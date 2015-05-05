var Promise = require('es6-promise').Promise;
var https = require('https');
var _ = require('lodash');

var restFetch = function(options, path) {
    var reqOptions = {
        port: 443,
        path: '/rest' + path,
    };
    reqOptions = _.assign(reqOptions, options);
    console.log('Requesting', reqOptions.path);
    return new Promise(function (resolve, reject) {
        https.get(reqOptions, function(response) {
            if (response.statusCode !== 200) {
                reject({ statusCode: response.statusCode });
            }

            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                try {
                    console.log('Received', reqOptions.path);
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

var jiraFetch = function(options, path) {
    return restFetch(options, '/api/2/' + path);
};

var greenHopperFetch = function(options, path) {
    return restFetch(options, '/greenhopper/1.0/' + path);
};

module.exports = {
    views: function(options) {
        return greenHopperFetch(options, 'rapidview');
    },

    sprints: function(options, id) {
        return greenHopperFetch(options, 'sprintquery/' + id);
    },

    sprint: function(options, viewId, sprintId) {
        return greenHopperFetch(options, 'rapid/charts/sprintreport?rapidViewId=' +
                viewId + '&sprintId=' + sprintId);
    },

    issueChangeLog: function(options, issue) {
        var dwell = [];
        return jiraFetch(options, 'issue/' + issue + '?expand=changelog');
    }
};
