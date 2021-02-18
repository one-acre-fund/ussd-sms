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
    it('should display a message saying the client is not enrolled and return null if the client is not enrolled in the current season',()=>{
        var result = getCode(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('The acccount number used did not place order in the current season');
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
});