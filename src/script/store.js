var Reflux = require('reflux');
var Promise = require('es6-promise').Promise;
var http = require('http');

var Store = Reflux.createStore({
    listenables: require('./actions'),

    _get: function(path) {
        return new Promise(function(resolve, reject) {
            http.get(path, function(response) {
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
            this.trigger({ dwells: result, loading: false });
        }.bind(this)).catch(function(err) {
            console.error(err);
        });
    }
});

module.exports = Store;
