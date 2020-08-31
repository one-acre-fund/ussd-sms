var logger = require('../slack-logger/index');

module.exports = function(env) {
    var projectVariables = {
        'server_name': project.vars[env + '_server_name'],
        'roster_api_key': project.vars[env + '_roster_api_key'],
        'roster_read_key': project.vars.roster_read_key,
        'varieties_table_id': project.vars[env + '_varieties_table_id'],
        'project_name': project.name,
        'service_name': service.name,
        'buy_back_transactions_table_id': project.vars[env + '_buy_back_transactions_table_id']
    };

    Object.keys(projectVariables).forEach(function(variable){
        if(!projectVariables[variable]) {
            logger.log('Malawi: project variable: ' + variable + ' is not set');
        }
    });
};
