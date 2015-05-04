var React = require('react');
var Actions = require('./actions');

var ViewSelect = React.createClass({
    onSelectView: function() {
        var views = this.refs.views.getDOMNode();
        var selected = views.options[views.selectedIndex];
        if (selected.value != 'none') {
            Actions.selectView(selected.value);
        }
    },

    render: function() {
        var options = this.props.views.map(function(view, idx) {
            return (
                <option value={view.id}
                    key={'view-' + idx}
                >
                    {view.name}
                </option>
            );
        });
        return (
            <div>
                <select ref="views"
                    onChange={this.onSelectView}
                >
                    <option value="none">Select a View</option>
                    {options}
                </select>
            </div>
        );
    }
});

module.exports = ViewSelect;
