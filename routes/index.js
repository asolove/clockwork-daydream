var jira = require('../lib/jira');

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
    }
};
