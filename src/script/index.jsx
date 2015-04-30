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
    componentDidMount: function() {
        http.get('/views', function(error, result) {
            if (error !== null) console.error(error);
            console.log(result);
        });
    },

    render: function() {
        return (
            <select ref="views">
                <option value="none">Select a View</option>
            </select>
        );
    }
});

module.exports = ViewSelect;
