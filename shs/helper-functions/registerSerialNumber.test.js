var registerSerialNumber = require ('./registerSerialNumber');
var {client} =  require('../../client-enrollment/test-client-data');
var registerSerial = require('../endpoints/registerSerial');
var getkeyCodeType = require('../helper-functions/getkeyCodeType');

jest.mock('../endpoints/registerSerial');
jest.mock('../helper-functions/getkeyCodeType');

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
        service.vars.current_enrollment_season_name = '2021, Long Rain';
        getkeyCodeType.mockReturnValueOnce('ACTIVATION');
    });
    it('should call register serial with the activation keyCode type and the type if given',()=>{
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        state.vars.client = JSON.stringify(client);
        registerSerialNumber('232490','biolite');
        expect(registerSerial).toHaveBeenCalledWith(mockRequestData);
    });
    it('should display a message asking the client to pay for the previous loan if the client is not enrolled in  the current season, and return null',()=>{
        client.BalanceHistory[0].SeasonName = '2020, Long Rain';
        client.BalanceHistory[0].TotalCredit  = 1300;
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 1200;
        state.vars.client = JSON.stringify(client);
        var result = registerSerialNumber(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('Kindly complete your loan to get your unlock codes');
        expect(result).toEqual(null);
    });
    it('should call register serial with the unlock keyCode if the client completed their loan in past seasons',()=>{
        client.BalanceHistory[0].SeasonName = '2020, Long Rain';
        client.BalanceHistory[0].TotalCredit  = 1000;
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 1200;
        state.vars.client = JSON.stringify(client);
        mockRequestData.keyCodeType = 'UNLOCK';
        registerSerialNumber('232490','biolite');
        expect(registerSerial).toHaveBeenCalledWith(mockRequestData);
    });


});