var logger = require('../slack-logger/index');

module.exports = function(env) {
    var projectVariables = {
        'server_name': project.vars[env + '_server_name'],
        'roster_read_key': project.vars.roster_read_key,
        'varieties_table': project.vars[env + '_varieties_table'],
        'project_name': project.name,
        'service_name': service.name,
        'buyback_transactions_table': project.vars[env + '_buyback_transactions_table']
    };

    Object.keys(projectVariables).forEach(function(variable){
        if(!projectVariables[variable]) {
            logger.log('Malawi: project variable: ' + variable + ' is not set');
        }
    });
};
