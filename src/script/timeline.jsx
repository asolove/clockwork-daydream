var React = require('react');

var Timeline = React.createClass({
    propTypes: {
        start: React.PropTypes.object,
        timeline: React.PropTypes.object
    },

    _dayOfWeek: function(idx) {
        switch(idx) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
        }
    },

    render: function() {
        if (!this.props.start) {
            return(<div/>);
        }
        var iteration = [];
        var startTime = this.props.start.getTime();
        for (var i = 0; i < 14; i++) {
            iteration.push(i);
        }
        console.log(this.props.timeline);
        var days = iteration.map(function(dayIdx) {
            var day = new Date(startTime + (dayIdx * 24 * 60 * 60 * 1000));
            var transitions = [];
            if (dayIdx in this.props.timeline) {
                transitions = this.props.timeline[dayIdx].map(function(transition, idx) {
                    return (
                        <div key={'transition-' + idx}>
                            {transition.key} - {transition.summary}<br />
                            Changed status to {transition.to}
                        </div>
                    );
                });
            }
            return (
                <div key={'day-' + dayIdx}>
                    <h3>{this._dayOfWeek(day.getDay())}</h3>
                    {transitions}
                </div>
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
