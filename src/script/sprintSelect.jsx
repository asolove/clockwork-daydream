var React = require('react');
var Actions = require('./actions');

var SprintSelect = React.createClass({
    onSprintSelect: function() {
        var sprints = this.refs.sprints.getDOMNode();
        var selected = sprints.options[sprints.selectedIndex];
        if (selected.value != 'none') {
            Actions.selectSprint(this.props.view, selected.value);
        }
    },

    render: function() {
        var options = this.props.sprints.map(function(sprint, idx) {
            return (
                <option value={sprint.id}
                    key={'sprint-' + idx}
                >
                    {sprint.name}
                </option>
            );
        });
        return (
            <div>
                <select ref="sprints"
                    onChange={this.onSprintSelect}
                >
                    <option value="none">Select a Sprint</option>
                    {options}
                </select>
            </div>
        );
    }
});

module.exports = SprintSelect;
