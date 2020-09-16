var logger = require('../slack-logger/index');

module.exports = function(env) {
    var projectVariables = {
        'server_name': project.vars[env + '_server_name'],
        'roster_read_key': project.vars.roster_read_key,
    };

    Object.keys(projectVariables).forEach(function(variable){
        if(!projectVariables[variable]) {
            logger.log('Repayments: project variable: ' + variable + ' is not set');
        }
    });
};
