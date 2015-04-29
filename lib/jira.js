var Promise = require('es6-promise').Promise;
var https = require('https');

var jiraFetch = function(username, password, path) {
    var options = {
        // TODO make configurable
        hostname: 'jira.freewebs.com',
        port: 443,
        path: '/rest/api/2/' + path,
        auth: username + ':' + password
    };
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
                resolve(JSON.parse(body));
            });
        }).on('error', function(e) {
            reject(e);
        });
    });
};

module.exports = {
    streamField: function(username, password) {
        jiraFetch(username, password, 'field').then(function(fields) {
            var streamFieldId;
            fields = fields.filter(function(field) {
                return field.name === 'Stream';
            });
            console.log(fields);
            //return jiraFetch('customFieldOption/' + 
        }).catch(function(e) {
            console.error(e);
        });
    }
};
