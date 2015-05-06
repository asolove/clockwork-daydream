var React = require('react');
var _ = require('lodash');
var TimelineDay = require('./timelineDay');

var Timeline = React.createClass({
    propTypes: {
        start: React.PropTypes.object,
        timeline: React.PropTypes.object
    },

    render: function() {
        if (!this.props.start) {
            return(<div/>);
        }
        var iteration = [];
        var startTime = this.props.start.getTime();
        // TODO sprint iteration length should be configurable
        for (var i = 0; i < 14; i++) {
            iteration.push(i);
        }
        var days = iteration.map(function(dayIdx) {
            var dayTransitions = (dayIdx in this.props.timeline) ?
                this.props.timeline[dayIdx] : [];
            return (
                <TimelineDay key={dayIdx}
                    index={dayIdx}
                    startTime={startTime}
                    transitions={dayTransitions}
                />
            );
        }.bind(this));
        return (
            <div>
                {days}
            </div>
        );
    }
});

module.exports = Timeline;
