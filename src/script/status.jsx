var React = require('react');

var Status = React.createClass({
    propTypes: {
        status: React.PropTypes.string.isRequired,
        tickets: React.PropTypes.array.isRequired,
        expand: React.PropTypes.bool
    },

    getInitialState: function() {
        return ({
            expand: (this.props.expand === null) ? true : this.props.expand
        });
    },

    _pluralize: function(items, term) {
        return '' + this.props.tickets.length + ' ' +
            ((this.props.tickets.length == 1) ? 'ticket' : 'tickets');
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

    render: function() {
        var idx = 0;
        var tickets = this.props.tickets.map(function(ticket) {
            idx++;
            return (
                <li key={idx}>
                    <strong>{ticket.key}</strong> - {ticket.summary}
                </li>
            );
        });
        var clickStyle = { cursor: 'pointer' };
        return (
            <div onClick={this.toggleDetail} style={clickStyle}>
                <div>
                    {(this.state.expand) ? '+' : '-'}
                    {this._pluralize()} moved to <strong>{this.props.status}</strong>
                </div>
                <div ref="detail" className="details hidden">
                    <ul>
                        {tickets}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = Status;
