var React = require('react');

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
