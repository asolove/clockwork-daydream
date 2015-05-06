var React = require('react');
var Status = require('./status');

var TimelineDay = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        startTime: React.PropTypes.number.isRequired,
        transitions: React.PropTypes.array.isRequired
    },

    // TODO desired statuses and ordering should be configurable
    transitions: [ 'Open', 'Ready', 'In Progress', 'In Code Review', 'Resolved', 'In Test', 'Reopenend', 'Validated',
        'Closed' ],

    _toDate: function() {
        return new Date(this.props.startTime + (this.props.index * 24 * 60 * 60 * 1000));
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
        var day = this._toDate();
        var statuses = {};
        this.props.transitions.forEach(function(transition) {
            if (!(transition.to in statuses)) {
                statuses[transition.to] = [];
            }
            statuses[transition.to].push(transition);
        });
        var idx = 0;
        // fixed ordering representing the transition flow, but only of
        // statuses that have tickets on the given day
        var transitions = this.transitions.filter(function(key) {
            return key in statuses;
        }).map(function(key) {
            idx++;
            return (
                <Status key={idx}
                    status={key}
                    tickets={statuses[key]}
                />
            );
        });
        return (
            <div>
                <h3>{this._dayOfWeek(day.getDay())}</h3>
                {transitions}
            </div>
        );
    }
});

module.exports = TimelineDay;
