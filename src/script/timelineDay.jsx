var React = require('react');
var Status = require('./status');
var _ = require('lodash');

var TimelineDay = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        startTime: React.PropTypes.number.isRequired,
        transitions: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
        return ({
            expandAll: true,
            expand: true
        });
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

    _pluralize: function() {
        return '' + this.props.transitions.length + ' ' +
            ((this.props.transitions.length === 1) ? 'change' : 'changes');
    },

    toggleDetail: function() {
        var detail = this.refs.detail.getDOMNode();
        if (detail.classList.contains('hidden')) {
            detail.classList.remove('hidden');
        } else {
            detail.classList.add('hidden');
        }
        this.setState({ expand: detail.classList.contains('hidden') });
    },

    toggleMoreDetail: function() {
        var detail = this.refs.detail.getDOMNode();
        var moreDetails = detail.querySelectorAll('.details');
        _.forEach(moreDetails, function(moreDetail) {
            if (this.state.expandAll) {
                moreDetail.classList.remove('hidden');
            } else {
                moreDetail.classList.add('hidden');
            }
        }.bind(this));
        this.setState({ expandAll: !this.state.expandAll });
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
                    expand={this.state.expandAll}
                />
            );
        });
        var clickStyle = { cursor: 'pointer' };
        return (
            <div>
                <h3 onClick={this.toggleDetail} style={clickStyle}>
                    {(this.state.expand) ? '+' : '-'}
                    {this._dayOfWeek(day.getDay())}
                </h3>
                <div ref="summary" className="summary">{this.pluralize}</div>
                <div ref="detail" className="details hidden">
                    <div ref="moredetail" onClick={this.toggleMoreDetail} style={clickStyle}>
                        {(this.state.expandAll) ? '+Expand All' : '-Collapse All'}
                    </div>
                    {transitions}
                </div>
            </div>
        );
    }
});

module.exports = TimelineDay;
