var registerSerialNumber = require ('./registerSerialNumber');
var {client} =  require('../../client-enrollment/test-client-data');
var registerSerial = require('../endpoints/registerSerial');

jest.mock('../endpoints/registerSerial');


var mockRequestData = {
    accountNumber: state.vars.account,
    countryCode: '404',
    unitSerialNumber: '232490',
    keyCodeType: 'ACTIVATION',
    unitType: 'biolite',
    isReplacement: undefined
   
};
describe('register serial number', () => {

    beforeAll(()=>{
        state.vars.country = 'KE';
        state.vars.client = JSON.stringify(client);
    });
    it('should display a message saying the client is not enrolled and return null if the client is not enrolled in the current season',()=>{
        var result = registerSerialNumber(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('The acccount number used did not place order in the current season');
        expect(result).toEqual(null);
    });
    it('should call register serial with the activation keyCode type and the type if given',()=>{
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        state.vars.client = JSON.stringify(client);
        registerSerialNumber('232490','biolite');
        expect(registerSerial).toHaveBeenCalledWith(mockRequestData);
    });
    it('should call register serial with the unlock keyCodeif the client complted their loan type and the type if given',()=>{
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        client.BalanceHistory[0].Balance = 0;
        state.vars.client = JSON.stringify(client);
        mockRequestData.keyCodeType = 'UNLOCK';
        registerSerialNumber('232490','biolite');
        expect(registerSerial).toHaveBeenCalledWith(mockRequestData);
    });


});