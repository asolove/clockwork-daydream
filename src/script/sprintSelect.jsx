var React = require('react');
var Actions = require('./actions');

var SprintSelect = React.createClass({
    propTypes: {
        view: React.PropTypes.number,
        sprint: React.PropTypes.number,
        sprints: React.PropTypes.array
    },

    componentDidMount: function() {
        if (this.props.sprint) {
            Actions.selectSprint(this.props.view, this.props.sprint);
        }
    },

    getInitialState: function() {
        return ({
            sprint: this.props.sprint
        });
    },

    onSprintSelect: function() {
        var sprints = this.refs.sprints.getDOMNode();
        var selected = sprints.options[sprints.selectedIndex];
        if (selected.value != '-1') {
            Actions.selectSprint(this.props.view, selected.value);
        }
        this.setState({ sprint: parseInt(selectedValue) });
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
                    value={this.state.sprint}
                >
                    <option value="none">Select a Sprint</option>
                    {options}
                </select>
            </div>
        );
    }
});

module.exports = SprintSelect;
