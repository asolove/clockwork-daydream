var Reflux = require('reflux');

var Actions = Reflux.createActions([
    'login',
    'loadViews',
    'selectView',
    'selectSprint'
]);

module.exports = Actions;
