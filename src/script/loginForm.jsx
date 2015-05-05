var React = require('react');
var Actions = require('./actions');

var LoginForm = React.createClass({
    propTypes: {
        message: React.PropTypes.string
    },

    login: function() {
        Actions.login(this.refs.hostname.getDOMNode().value,
                      this.refs.username.getDOMNode().value,
                      this.refs.password.getDOMNode().value);
    },

    render: function() {
        return (
            <div>
                <div>
                    <label htmlFor="jiraHost">Jira Hostname</label>:
                    <input id="jiraHost"
                        ref="hostname"
                        type="text"
                    />
                </div>
                <div>
                    <label htmlFor="jiraUsername">Jira Username</label>:
                    <input id="jiraUsername"
                        ref="username"
                        type="text"
                    />
                </div>
                <div>
                    <label htmlFor="jiraPassword">Jira Password</label>:
                    <input id="jiraPassword"
                        ref="password"
                        type="password"
                    />
                </div>
                <div>
                    <input type="button"
                        onClick={this.login}
                        value="Login"
                    />
                </div>
            </div>
        );
    }
});

module.exports = LoginForm;
