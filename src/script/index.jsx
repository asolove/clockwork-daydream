var React = require('react');

if (window) {
    window.statsTools = {
        renderApp: function(rootEl) {
            React.render(<ViewSelect />, rootEl);
        }
    };
}

var ViewSelect = React.createClass({
    render: function() {
        return (
            <select ref="views">
                <option value="none">Select a View</option>
            </select>
        );
    }
});

module.exports = ViewSelect;
