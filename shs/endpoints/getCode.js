
module.exports = function (requestData){
    console.log('requetData:'+ JSON.stringify(requestData));

    //double unlock
    if((requestData.accountNumber == '30442923' || requestData.accountNumber == '15640569' || requestData.accountNumber == '18007901') && requestData.keyCodeType == 'unlock'){
        return [
            {
                'unitType': 'biolite',
                'unitSerialNumber': '11275434',
                'keyCode': '123 456 789',
                'keyCodeType': 'unlock'
            },
            {
                'unitType': 'sunking',
                'unitSerialNumber': '64875628',
                'keyCode': '123 466 799',
                'keyCodeType': 'unlock'
            }
        ];
    }
    //single Unlock
    else if((requestData.accountNumber == '20885173' || requestData.accountNumber == '30879777' || requestData.accountNumber == '10011690' || requestData.accountNumber == '30826484') && requestData.keyCodeType == 'unlock'){
        return [{
            'unitType': 'sunking',
            'unitSerialNumber': '64875628',
            'keyCode': '123 466 799',
            'keyCodeType': 'unlock'
        }];

    }

    //single activation
    else if((requestData.accountNumber == '31619063' || requestData.accountNumber == '29345101' || requestData.accountNumber == '30825742') && requestData.keyCodeType == 'activation'){
        return [{
            'unitType': 'sunking',
            'unitSerialNumber': '64875628',
            'keyCode': '123 466 799',
            'keyCodeType': 'activation'
        }];
    }
    //double activation
    else if((requestData.accountNumber == '31483941' || requestData.accountNumber == '29752758' || requestData.accountNumber == '18873856') && requestData.keyCodeType == 'activation'){
        return [{
            'unitType': 'sunking',
            'unitSerialNumber': '16226110',
            'keyCode': '677 560 290',
            'keyCodeType': 'activation'
        },{
            'unitType': 'sunking',
            'unitSerialNumber': '19748766',
            'keyCode': '245 457 739',
            'keyCodeType': 'activation'
        }];
    }
    // return [
    //     {
    //         'unitType': 'biolite',
    //         'unitSerialNumber': '23456789',
    //         'keyCode': '123 456 789',
    //         'keyCodeType': 'activation'
    //     },
    //     {
    //         'unitType': 'sunking',
    //         'unitSerialNumber': '53456562',
    //         'keyCode': '123 466 799',
    //         'keyCodeType': 'unlock'
    //     }
    // ];

};