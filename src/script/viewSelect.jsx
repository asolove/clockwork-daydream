var React = require('react');
var Actions = require('./actions');

var ViewSelect = React.createClass({
    propTypes: {
        view: React.PropTypes.number,
        views: React.PropTypes.array
    },

    componentDidMount: function() {
        if (this.props.view) {
            Actions.selectView(this.props.view);
        }
    },

    getInitialState: function() {
        return ({
            view: this.props.view
        });
    },

    onSelectView: function() {
        var views = this.refs.views.getDOMNode();
        var selected = views.options[views.selectedIndex];
        if (selected.value != '-1') {
            Actions.selectView(selected.value);
        }
        this.setState({ view: parseInt(selected.value) });
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
        }.bind(this));
        return (
            <div>
                <select ref="views"
                    onChange={this.onSelectView}
                    value={this.state.view}
                >
                    <option value="-1">Select a View</option>
                    {options}
                </select>
            </div>
        );
    }
});

module.exports = ViewSelect;
