const getTransactionHistory = require('./getTransactionHistory');
const Log = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

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
    let mockLogger;
    beforeEach(() => {
        mockLogger ={ error: jest.fn() };
        Log.mockReturnValue(mockLogger);
    });
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
    it('should log an error when the response code is not 200', () => {
        const mockResponse = { status: 404, content: mockResponseData };
        httpClient.request.mockReturnValueOnce(mockResponse);
        getTransactionHistory(mockClient);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to fetch client transactions', 
            {data: mockResponse}
        );
    });
    it('should return an empty array if the response code is not 200', () => {
        httpClient.request.mockReturnValueOnce({status: 401, content: mockResponseData});
        const result = getTransactionHistory(mockClient);
        expect(result).toEqual([]);
    });
    it('should log an error when the request throws an error', () => {
        const error = new Error ('Oh no an Error');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        getTransactionHistory(mockClient);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Error fetching client transactions', 
            {data: error}
        );        
    });
    it('shoud return an empty array if the request throws an error', () => {
        httpClient.request.mockImplementationOnce(()=>{throw 'Oh no an Error';});
        const result = getTransactionHistory(mockClient);
        expect(result).toEqual([]);
    });
    it('should return only the first 20 items if the response content contains more than that', () => {
        const mockLongResponse = Array.from(Array(40).keys());
        httpClient.request.mockReturnValueOnce({status: 200, content: JSON.stringify(mockLongResponse)});
        const result = getTransactionHistory(mockClient);
        expect(result).toEqual(mockLongResponse.slice(0,20));
        expect(result).toHaveLength(20);
    });

});