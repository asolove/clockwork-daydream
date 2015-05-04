var jira = require('../lib/jira');
var Promise = require('es6-promise').Promise;

module.exports = {
    views: function(req, res) {
        if (!req.app.get('jira.views')) {
            jira.views(req.app);
            // TODO signal client to retry?
            res.end([]);
            return;
        }
        res.json(req.app.get('jira.views'));
    },

    sprints: function(req, res) {
        jira.sprints(req.app, req.params.id).then(function(result) {
            // TODO cache sprints
            var sprints = result.sprints.map(function(sprint) {
                return ({ id: sprint.id, name: sprint.name });
            });
            res.json(sprints);
        });
    },

    sprint: function(req, res) {
        jira.sprint(req.app, req.params.viewId, req.params.sprintId).then(function(result) {
            // TODO cache sprint data
            var issues = [].concat(result.contents.completedIssues, result.contents.incompletedIssues);
            Promise.all(issues.map(function(issue) {
                return jira.issueChangeLog(req.app, issue.id).then(function(issue) {
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
                res.json(dwells);
            });
        });
    }
};
