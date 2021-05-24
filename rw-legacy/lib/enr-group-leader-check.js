/*
    script: enr-group-leader-check.js
    function: saves client as GL if there isn't a GL already in the group
*/

module.exports = function(client, glus_id, an_table_name, glus_table_name){
    client = an_table.queryRows({vars: {'account_number': client}}).next(); //assumes that this client has been saved already
    if(!glus_id) {
        client.vars.group_leader = 1;
        client.save();
        return true;
    }
    var an_table = project.getOrCreateDataTable(an_table_name);
    var group_leader = an_table.queryRows({vars: {'glus': glus_id, 'group_leader': 1}});
    // assign client to be a group leader if there are no other group leaders in the group; otherwise, assign to be member
    if(group_leader.count() < 1){
        console.log('in gl check: vars: ' + JSON.stringify(client.vars) + '\ngl check count : ' + group_leader.count());
        client.vars.group_leader = 1;
        client.save();
        console.log('gl? (line18): ' + client.vars.group_leader);
        return true;
    }
    else{
        //client.vars.group_leader = 0;
        //client.save();
        return false;
    }
};
