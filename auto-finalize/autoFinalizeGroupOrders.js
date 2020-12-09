var msgs = require('../rw-legacy/lib/msg-retrieve');
var messager = require('../rw-legacy/lib/enr-messager');
var enrollOrder = require('../Roster-endpoints/enrollOrder');
const triggerService = require('../shared/triggerService');

global.main = function () {
    console.log('starting order auto-finalize');

    var glAccountNumber = contact.vars.account_number;
    service.vars.lang = service.vars.lang ? service.vars.lang : 'ki';
    service.vars.cursorLimit = service.vars.cursorLimit ? service.vars.cursorLimit : 10;

    var env = service.vars.env === 'prod' || service.vars.env === 'dev'
        ? service.vars.env
        : service.active
            ? 'prod'
            : 'dev';

    service.vars.server_name = service.vars.server_name ? service.vars.server_name : project.vars[env + '_server_name'];
    service.vars.roster_api_key = project.vars[env + '_roster_api_key'];

    var clientOrderTableId;
    var bundleTableId;
    if (env === 'prod') {
        clientOrderTableId = project.vars['21a_client_data_id'];
        bundleTableId = project.vars['input21ATable_id'];
    } else {
        clientOrderTableId = project.vars['dev_21a_client_data_id'];
        bundleTableId = project.vars['dev_input21ATable_id'];
    }

    var bundlesCursor = project.initDataTableById(bundleTableId).queryRows({});

    var bundles = {};
    while (bundlesCursor.hasNext()) {
        var bundleRow = bundlesCursor.next();
        bundles[bundleRow.vars.bundle_name] = {
            bundleId: bundleRow.vars.bundleId,
            inputChoices: [bundleRow.vars.bundleInputId]
        };
    }

    var glOrderCursor = project.initDataTableById(clientOrderTableId).queryRows({
        'vars': {
            'account_number': glAccountNumber,
        }
    });

    var gid = glOrderCursor.hasNext() ? glOrderCursor.next().glus : '';

    if (!gid) {
        console.log('gid is empty');
        return;
    }
    var cursor = project.initDataTableById(clientOrderTableId).queryRows({
        'vars': {
            'glus': gid,
            'finalized': null,
            'rgo_placed_order': 1,
        }
    });

    if (!cursor.hasNext()) {
        console.log('no record found');
        return;
    }

    var groupInfo = parseGId(row.vars.glus);

    var row = cursor.next();
    var unixNow = Math.floor(new Date().getTime() / 1000);
    var daysSinceLastUpdate = Math.floor((unixNow - row.time_updated) / (24 * 60 * 60));
    if (daysSinceLastUpdate >= 3) {
        var clientBundles = [];

        Object.keys(bundles).forEach(function (bundleName) {
            var quantity = row.vars[bundleName];
            if (quantity) {
                var bundle = bundles[bundleName];
                clientBundles.push({
                    bundleId: bundle.bundleId,
                    bundleQuantity: quantity,
                    inputChoices: bundle.inputChoices
                });
            }
        });

        var requestData = {
            'districtId': groupInfo.districtId,
            'siteId': groupInfo.siteId,
            'groupId': groupInfo.groupId,
            'accountNumber': row.vars.account_number,
            'isGroupLeader': row.vars.group_leader === 1,
            'clientBundles': clientBundles
        };

        if (!row.vars.glus) {
            console.log('client glus not found');
            continue;
        }

        if (enrollOrder(requestData)) {
            row.vars.finalized = 1;
            row.vars.autofinalized = 1;
            row.save();
            if (row.vars.user_pn) {
                messager(row.vars.user_pn, msgs('enr_autofinalize', { '$ACCOUNT': key }, service.vars.lang));
            }
        } else {
            console.log('enrollment failed for ' + row.vars.account_number)
        }

    }

    contact.vars.account_number = row.vars.account_number;
    triggerService('SVd394122df79f2a3c', {
        context: 'contact',
        async: true
    })

    console.log('finished order auto-finalize');
};

function parseGId(gid) {
    var districtId = parseInt(gid.slice(0, 5), 10);
    var siteId, groupId;
    var group_code = gid.replace(/\W/g, '-');
    if (group_code[5] == '-') { //siteId is negative
        siteId = parseInt(group_code.slice(5, 9), 10);
        if (group_code[9] == '-') { //groupId is negative
            groupId = parseInt(group_code.slice(9, group_code.length), 10);
        } else {
            groupId = parseInt(group_code.slice(8, group_code.length), 10);
        }

    } else {
        siteId = parseInt(group_code.slice(5, 8), 10);
        if (group_code[9] == '-') { //groupId is negative
            groupId = parseInt(group_code.slice(9, group_code.length), 10);
        } else {
            groupId = parseInt(group_code.slice(8, group_code.length), 10);
        }
    }

    return {
        districtId: districtId,
        siteId: siteId,
        groupId: groupId
    }
}