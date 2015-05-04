var React = require('react');
var Reflux = require('reflux');
var Store = require('./store');
var Actions = require('./actions');
var ViewSelect = require('./viewSelect');
var SprintSelect = require('./sprintSelect');

if (window) {
    window.statsTools = {
        renderApp: function(rootEl) {
            React.render(<JiraStats />, rootEl);
        }
    };
}

var JiraStats = React.createClass({
    mixins: [Reflux.connect(Store)],

    componentDidMount: function() {
        Actions.loadViews();
    },

    getInitialState: function() {
        return ({ views: [], sprints: [] });
    },

    render: function() {
        return (
            <div>
                <ViewSelect views={this.state.views} />
                <SprintSelect sprints={this.state.sprints} />
            </div>
        );
    }
});

module.exports = JiraStats;
