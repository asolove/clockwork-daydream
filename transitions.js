var https = require('https');

module.exports = {
    dwell: function(req, res) {
        var options = {
            hostname: 'jira.freewebs.com',
            path: '/rest/api/2/field',
            auth: req.app.get('username') + ':' + req.app.get('password')
        };
        https.get(options, function(response) {
            if (response.statusCode !== 200) {
                console.error('Failed', response.statusCode);
            }

            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                console.log(body);
                res.render('dwell');
            });
        }).on('error', function(e) {
            console.error(e);
        });
    }
};
