var React = require('react');
var Reflux = require('reflux');
var Store = require('./store');
var Actions = require('./actions');
var ViewSelect = require('./viewSelect');
var SprintSelect = require('./sprintSelect');
var _ = require('lodash');

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
        return ({
            views: [],
            sprints: [],
            dwells: [],
            loading: false
        });
    },

    // thanks http://stackoverflow.com/a/8212878
    _formatMs: function millisecondsToStr (milliseconds) {
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();

        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }

        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks? 
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'less than a second'; //'just now' //or other string you like;
    },

    render: function() {
        var loading = (this.state.loading) ? (<div>Loading...</div>) : '';
        var content = _.map(this.state.dwells, function(value, key) {
            var sum = value.reduce(function(prev, curr) {
                return prev + curr;
            }, 0);
            var average = this._formatMs(sum / value.length);
            return (
                <div>
                    {key}: {average} ({value.length} tickets in this status*)
                </div>
            );
        }.bind(this));
        return (
            <div>
                <ViewSelect views={this.state.views} />
                <SprintSelect 
                    view={this.state.viewId}
                    sprints={this.state.sprints}
                />
                <div>
                    {loading}
                    {content}
                    <div>*including same ticket in same status repeatedly</div>
                </div>
            </div>
        );
    }
});

module.exports = JiraStats;
