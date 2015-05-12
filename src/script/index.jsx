var React = require('react');
var Reflux = require('reflux');
var Store = require('./store');
var Actions = require('./actions');
var ViewSelect = require('./viewSelect');
var SprintSelect = require('./sprintSelect');
var LoginForm = require('./loginForm');
var Timeline = require('./timeline');
var _ = require('lodash');

if (window) {
    window.statsTools = {
        renderApp: function(rootEl, authenticated, view, sprint) {
            React.render(<JiraStats authenticated={authenticated}
                            view={view}
                            sprint={sprint}
                        />, rootEl);
            if (authenticated) {
                Actions.loadViews();
            }
        }
    };
}

var JiraStats = React.createClass({
    mixins: [Reflux.connect(Store)],

    propTypes: {
        authenticated: React.PropTypes.bool.isRequired,
        view: React.PropTypes.number,
        sprint: React.PropTypes.number
    },

    getInitialState: function() {
        return ({
            views: [],
            sprints: [],
            dwells: [],
            timeline: {},
            loading: false,
            authenticated: this.props.authenticated,
            view: this.props.view,
            sprint: this.props.sprint,
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
                <div key={key}>
                    {key}: {average} ({value.length} tickets in this status*)
                </div>
            );
        }.bind(this));
        if (content.length > 0) {
            content.push(
                <div key="hint">*including same ticket in same status repeatedly</div>
            );
        }
        var loginStyle = { display: (this.state.authenticated) ? 'none' : '' };
        var reportStyle = { display: (this.state.authenticated) ? '' : 'none' };
        return (
            <div>
                <div style={loginStyle}>
                    <LoginForm message={this.state.message} />
                </div>
                <div style={reportStyle}
                    className="report-container"
                >
                    <ViewSelect view={this.state.view}
                        views={this.state.views}
                    />
                    <SprintSelect sprint={this.state.sprint}
                        view={this.state.view}
                        sprints={this.state.sprints}
                    />
                    <div className="report-quadrant">
                        <h2>Average Dwell Time</h2>
                        {loading}
                        {content}
                    </div>
                    <div className="report-quadrant">
                        <h2>Event Timeline</h2>
                        {loading}
                        <Timeline start={this.state.start}
                            timeline={this.state.timeline}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = JiraStats;
