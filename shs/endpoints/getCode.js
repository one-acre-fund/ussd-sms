
module.exports = function (requestData){
    console.log('requetData:'+ JSON.stringify(requestData));
    return [
        {
            'unitType': 'biolite',
            'unitSerialNumber': '23456789',
            'keyCode': '123 456 789',
            'keyCodeType': 'activation'
        },
        {
            'unitType': 'sunking',
            'unitSerialNumber': '53456562',
            'keyCode': '123 466 799',
            'keyCodeType': 'unlock'
        }
    ];

};