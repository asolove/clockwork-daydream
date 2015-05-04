var Reflux = require('reflux');
var http = require('http');

var Store = Reflux.createStore({
    listenables: require('./actions'),

    onLoadViews: function() {
        console.log('Loading views.');
        http.get('/views', function(response) {
            var data = '';

            response.on('data', function(buf) {
                data += buf;
            });

            response.on('end', function() {
                try {
                    var result = JSON.parse(data);
                    this.trigger({ views: result });
                } catch(err) {
                    console.error(err);
                }
            }.bind(this));
        }.bind(this)).on('error', function(err) {
            console.error(err);
        });
    },

    onSelectView: function(id) {
        http.get('/sprints/' + id, function(response) {
            var data = '';

            response.on('data', function(buf) {
                data += buf;
            });

            response.on('end', function() {
                try {
                    var result = JSON.parse(data);
                    this.trigger({ sprints: result });
                } catch(err) {
                    console.error(err);
                }
            }.bind(this));
        }.bind(this)).on('error', function(err) {
            console.error(err);
        });
    },

    onSelectSprint: function(id) {
    }
});

module.exports = Store;
