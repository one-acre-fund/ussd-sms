const getTransactionHistory = require('.');
const slack = require('../../slack-logger');

jest.mock('../../slack-logger');

const mockClient = {
    'GlobalClientId': '420057ed-de54-e711-b69c-79a8s798794',
    'AccountNumber': '10477597',
    'ClientName': 'Ka, Ii',
    'FirstName': 'Ii',
    'LastName': 'Ka',
    'ClientId': 9621,
    'DistrictId': 2834,
    'RegionName': 'Iringa',
    'CountryId': 834,
    'CountryName': 'Tanzania',
};
service.vars.server_name = 'http://example.com';
service.vars.roster_api_key = 'some-api-key';

const mockClientRepayments = [{a: '1'}, {b: '2'}, {c: '3'}];
const mockResponseData = JSON.stringify(mockClientRepayments);

describe('getTransactionHistory', () => {
    it('should be a function', () => {
        expect(getTransactionHistory).toBeInstanceOf(Function);
    });
    it('should call Http.request', () => {
        getTransactionHistory(mockClient);
        expect(httpClient.request).toHaveBeenCalledWith(
            `${service.vars.server_name }/Api/ClientRepayment/Get/?ClientId=${mockClient.ClientId}&DistrictId=${mockClient.DistrictId}`,
            {
                headers: { 'Authorization': `Token ${service.vars.roster_api_key}` },
                method: 'GET'
            }
        );
    });

    it('should return client repayments if the request is succesful', () => {
        httpClient.request.mockReturnValueOnce({status: 200, content: mockResponseData});
        const result = getTransactionHistory(mockClient);
        expect(result).toEqual(mockClientRepayments);
    });
    it('should call slack when the response code is not 200', () => {
        httpClient.request.mockReturnValueOnce({status: 404, content: mockResponseData});
        getTransactionHistory(mockClient);
        expect(slack.log).toHaveBeenCalled();
    });
    it('should return an empty array if the response code is not 200', () => {
        httpClient.request.mockReturnValueOnce({status: 401, content: mockResponseData});
        const result = getTransactionHistory(mockClient);
        expect(result).toEqual([]);
    });
    it('should cann slack when the request throws an error', () => {
        httpClient.request.mockImplementationOnce(()=>{throw 'Oh no an Error';});
        slack.log.mockClear();
        getTransactionHistory(mockClient);
        expect(slack.log).toHaveBeenCalledWith(expect.stringContaining('Error fetching client transactions: Oh no an Error'));        
    });
    it('shoud return an empty array if the request throws an error', () => {
        httpClient.request.mockImplementationOnce(()=>{throw 'Oh no an Error';});
        const result = getTransactionHistory(mockClient);
        expect(result).toEqual([]);
    });

});