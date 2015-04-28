var http = require('http');

module.exports = {
    dwell: function(req, res) {
        var url = 'https://' + req.app.get('username') +
            ':' + req.app.get('password') +
            '@jira.freewebs.com/resta/api/2/listFields';
        http.get(url, function(response) {
            if (response.statusCode !== 200) {
                console.error('Failed', response.statusCode);
            }
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                console.log(body);
            });
        }).on('error', function(e) {
            console.error(e);
        });
        res.render('dwell');
    }
};
