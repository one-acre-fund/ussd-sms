// Returns 201 for successful registration and body:{[{activationCode: '000-000',type: 'type'},{activationCode: '000-000',type: 'other-type'}]}


module.exports = function (requestData){
    console.log('requetData:'+ JSON.stringify(requestData));

    if(requestData.unitType == 'biolite' || requestData.unitType == 'sunking' ){
        return [
            {
                'unitType': requestData.unitType,
                'unitSerialNumber': '23456789',
                'keyCode': '123 456 789',
                'keyCodeType': 'activation'
            }
        ];
    }
    return [
        {
            'unitType': 'biolite',
            'unitSerialNumber': '23456789',
            'keyCode': '123 456 789',
            'keyCodeType': 'activation'
        },
        {
            'unitType': 'sunking',
            'unitSerialNumber': '23456789',
            'keyCode': '123 466 799',
            'keyCodeType': 'unlock'
        }
    ];

};