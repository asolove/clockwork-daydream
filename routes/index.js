var jira = require('../lib/jira');
var Promise = require('es6-promise').Promise;

module.exports = {
    // this app has no local authentication, instead it immediately tries to get
    // the board views from Jira to test the provided credentials and
    // incidentally caches the result
    login: function(req, res) {
        var options = {
            hostname: req.body.hostname,
            auth: req.body.username + ':' + req.body.password
        };

        req.session.options = options;

        jira.views(options).then(function(result) {
            req.session.views = result.views.filter(function(view) {
                return view.sprintSupportEnabled;
            }).map(function(view) {
                return { id: view.id, name: view.name };
            });
            res.json({ success: true });
        }).catch(function(err) {
            res.json({ success: false, error: err });
        });
    },

    // returns the views cached by login, the UI disallows hitting this end
    // point unless logged in
    views: function(req, res) {
        // TODO handle a direct call without logging in, perhaps a 401?
        res.json(req.session.views);
    },

    // for a provided Jira board, return the ids and names for the available
    // sprints
    sprints: function(req, res) {
        // TODO handle a direct call without logging in, perhaps a 401?
        jira.sprints(req.session.options, req.params.id).then(function(result) {
            // TODO cache sprints
            var sprints = result.sprints.map(function(sprint) {
                return ({ id: sprint.id, name: sprint.name });
            });
            res.json(sprints);
        });
    },

    // for a provided sprint, fetch a subset of detailed information for all
    // included tickets in the sprint
    sprint: function(req, res) {
        jira.sprint(req.session.options, req.params.viewId, req.params.sprintId).then(function(result) {
            // TODO cache sprint data
            var issues = [].concat(result.contents.completedIssues, result.contents.incompletedIssues);
            // coordinate across all the async calls for issue details
            Promise.all(issues.map(function(sprintIssue) {
                return jira.issueChangeLog(req.session.options, sprintIssue.id).then(function(issue) {
                    // TODO can this be tightened up, perhaps with lodash?
                    var lastDate = new Date(issue.fields.created);
                    return issue.changelog.histories.filter(function(history) {
                        var interested = history.items.filter(function(item) {
                            return item.field === 'status';
                        });
                        return interested.length > 0;
                    }).map(function(history) {
                        var interested = history.items.filter(function(item) {
                            return item.field === 'status';
                        });
                        var end = new Date(history.created);
                        var dwell = end.getTime() - lastDate.getTime();
                        lastDate = end;
                        return { dwell: dwell, status: interested[0].fromString };
                    });
                });
            // filter and map out the info of interest once all tickets are
            // availalbe so all info can be rendered at once
            })).then(function (values) {
                var dwells = {};
                values.forEach(function(issueList) {
                    issueList.forEach(function(dwell) {
                        if (!(dwell.status in dwells)) {
                            dwells[dwell.status] = [];
                        }
                        dwells[dwell.status].push(dwell.dwell);
                    });
                });
                res.json({
                    dwells: dwells
                });
            });
        });
    }
};
