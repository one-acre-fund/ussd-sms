var getCode = require ('./getCode');
var {client} =  require('../../client-enrollment/test-client-data');
var getCodes = require('../endpoints/getCode');

jest.mock('../endpoints/getCode');

var mockRequestData = {
    accountNumber: client.AccountNumber,
    countryCode: '404'
};

describe('getCode test', () => {

    beforeAll(()=>{
        state.vars.country = 'KE';
        state.vars.client = JSON.stringify(client);
    });
    it('should display a message asking the client to pay previous loan and return null if the client is not enrolled in the current season and has balance',()=>{
        client.BalanceHistory[0].SeasonName = '2019, Long Rain';
        client.BalanceHistory[0].TotalCredit  = 1300;
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 1200;
        state.vars.client = JSON.stringify(client);
        var result = getCode(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('Kindly complete your loan to get your unlock codes');
        expect(result).toEqual(null);
    });
    it('should retun the value returned by getCodes if the client is enrolled in the current season',()=>{
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        state.vars.client = JSON.stringify(client);
        getCodes.mockReturnValueOnce(JSON.stringify(client));
        var result = getCode(client.AccountNumber);
        expect(getCodes).toHaveBeenCalled();
        expect(result).toEqual(result);
    });

    it('should call getCode with 404 as country if the country is KE',()=>{
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        state.vars.client = JSON.stringify(client);
        getCodes.mockReturnValueOnce(JSON.stringify(client));
        getCode(client.AccountNumber);
        expect(getCodes).toHaveBeenCalledWith(mockRequestData);
    });
    it('should retun the value returned by getCodes if the client is enrolled in previous seasons and has paid their loan',()=>{
        client.BalanceHistory[0].SeasonName = '2019, Long Rain';
        client.BalanceHistory[0].TotalCredit  = 100;
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 1200;
        state.vars.client = JSON.stringify(client);
        getCodes.mockReturnValueOnce(JSON.stringify(client));
        var result = getCode(client.AccountNumber);
        expect(getCodes).toHaveBeenCalled();
        expect(result).toEqual(result);
    });
});