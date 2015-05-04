var React = require('react');
var http = require('http');

if (window) {
    window.statsTools = {
        renderApp: function(rootEl) {
            React.render(<ViewSelect />, rootEl.querySelector('#selectView'));
        }
    };
}


var ViewSelect = React.createClass({
    getInitialState: function() {
        return { views: [] };
    },

    componentDidMount: function() {
        http.get('/views', function(response) {
            var data = '';

            response.on('data', function(buf) {
                data += buf;
            });

            response.on('end', function() {
                try {
                    var result = JSON.parse(data);
                    this.setState({ views: result });
                } catch(err) {
                    console.error(err);
                }
            }.bind(this));
        }.bind(this)).on('error', function(err) {
            console.error(err);
        });
    },

    render: function() {
        var options = this.state.views.map(function(view) {
            return (
                <option value={view.id}>{view.name}</option>
            );
        });
        return (
            <select ref="views">
                <option value="none">Select a View</option>
                {options}
            </select>
        );
    }
});

module.exports = ViewSelect;
