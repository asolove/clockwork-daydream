var Reflux = require('reflux');
var Promise = require('es6-promise').Promise;
var https = require('https');
var Actions = require('./actions');

var Store = Reflux.createStore({
    listenables: Actions,

    _get: function(path) {
        return new Promise(function(resolve, reject) {
            https.get(path, function(response) {
                var data = '';

                response.on('data', function(buf) {
                    data += buf;
                });

                response.on('end', function() {
                    try {
                        resolve(JSON.parse(data));
                    } catch(err) {
                        reject(err);
                    }
                });
            }).on('error', function(err) {
                reject(err);
            });
        });
    },

    _post: function(path, data) {
        return new Promise(function(resolve, reject) {
            var dataString = JSON.stringify(data);

            var headers = {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            };

            var options = {
                hostname: location.hostname,
                port: location.port,
                path: path,
                method: 'POST',
                headers: headers
            };

            var req = https.request(options, function(response) {
                var data = '';

                response.on('data', function(buf) {
                    data += buf;
                });

                response.on('end', function() {
                    try {
                        resolve(JSON.parse(data));
                    } catch(err) {
                        reject(err);
                    }
                });
            }).on('error', function(err) {
                reject(err);
            });

            req.write(dataString);
            req.end();
        });
    },

    onLogin: function(hostname, username, password) {
        var options = {
            hostname: hostname,
            username: username,
            password: password
        };
        this._post('/login', options).then(function(res) {
            if (res.success) {
                Actions.loadViews();
                this.trigger({ authenticated: true });
            } else {
                console.error(res.error);
                this.trigger({ authenticated: true, message: 'Login failed.' });
            }
        }.bind(this)).catch(function(err) {
            console.error(err);
            this.trigger({ authenticated: true, message: 'Login failed.' });
        });
    },

    onLoadViews: function() {
        this._get('/views').then(function(result) {
            this.trigger({ views: result });
        }.bind(this)).catch(function(err) {
            console.error(err);
        });
    },

    onSelectView: function(id) {
        this._get('/sprints/' + id).then(function(result) {
            this.trigger({
                viewId: id,
                sprints: result
            });
        }.bind(this)).catch(function(err) {
            console.error(err);
        });
    },

    onSelectSprint: function(viewId, sprintId) {
        this.trigger({ loading: true, dwells: [] });
        this._get('/sprint/' + viewId + '/' + sprintId).then(function(result) {
            this.trigger({ dwells: result.dwells, loading: false });
        }.bind(this)).catch(function(err) {
            console.error(err);
        });
    }
});

module.exports = Store;
