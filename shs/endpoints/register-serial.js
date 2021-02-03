// Returns 201 for successful registration and body:{[{activationCode: '000-000',type: 'type'},{activationCode: '000-000',type: 'other-type'}]}


module.exports = function (requestData){
    console.log('requetData:'+ JSON.stringify(requestData));


    if((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647)){
        return [
            {
                'unitType': 'biolite',
                'unitSerialNumber': '13146227',
                'keyCode': '123 456 789',
                'keyCodeType': 'unlock'
            }];

    }
    if(((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647)) && requestData.unitType == 'biolite' && requestData.keyCodeType == 'unlock'){
        return [
            {
                'unitType': 'biolite',
                'unitSerialNumber': '13146227',
                'keyCode': '123 456 789',
                'keyCodeType': 'unlock'
            }];
    }
    else if(((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647))&& requestData.unitType == 'sunking' && requestData.keyCodeType == 'activation'){
        return [
            {
                'unitType': 'sunking',
                'unitSerialNumber': '13146227',
                'keyCode': '123 466 799',
                'keyCodeType': 'activation'
            }
        ];
    }
    if(((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647)) && requestData.unitType == 'biolite' && requestData.keyCodeType == 'activation'){
        return [
            {
                'unitType': 'biolite',
                'unitSerialNumber': '13146227',
                'keyCode': '123 456 789',
                'keyCodeType': 'activation'
            }];
    }
    else if(((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647)) && requestData.unitType == 'sunking' && requestData.keyCodeType == 'unlock'){
        return [
            {
                'unitType': 'sunking',
                'unitSerialNumber': '13146227',
                'keyCode': '123 466 799',
                'keyCodeType': 'unlock'
            }
        ];
    }

    else if(((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647))  && requestData.keyCodeType == 'unlock'){
        return [
            {
                'unitType': 'biolite',
                'unitSerialNumber': '13146227',
                'keyCode': '123 456 789',
                'keyCodeType': 'unlock'
            },
            {
                'unitType': 'sunking',
                'unitSerialNumber': '13146227',
                'keyCode': '123 466 799',
                'keyCodeType': 'unlock'
            }
        ];  
    }
    else if(((requestData.unitSerialNumber == 13246227) || (requestData.unitSerialNumber == 10966520) || (requestData.unitSerialNumber == 14581647))  && requestData.keyCodeType == 'activation'){
        return [
            {
                'unitType': 'biolite',
                'unitSerialNumber': '13146227',
                'keyCode': '123 456 789',
                'keyCodeType': 'activation'
            },
            {
                'unitType': 'sunking',
                'unitSerialNumber': '13146227',
                'keyCode': '123 466 799',
                'keyCodeType': 'activation'
            }
        ];  
    }
    else{
        if(requestData.keyCodeType == 'activation' && (requestData.unitSerialNumber == 16992686 || requestData.unitSerialNumber == 13178995)){
            return [{
                'unitType': 'biolite',
                'unitSerialNumber': '23456789',
                'keyCode': '123 456 789',
                'keyCodeType': 'activation'
            }];
        }else if(requestData.keyCodeType == 'unlock' && (requestData.unitSerialNumber == 16992686 || requestData.unitSerialNumber == 13178995)){
            return [{
                'unitType': 'biolite',
                'unitSerialNumber': '23456789',
                'keyCode': '123 456 789',
                'keyCodeType': 'unlock'
            }];
        }
    }
};