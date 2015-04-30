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
    }
};
