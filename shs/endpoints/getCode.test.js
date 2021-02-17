const getCode = require('./getCode');
const Log = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

const mockRequestData = {
    accountNumber: '24450523',
    countryCode: '404'
};
service.vars.shs_reg_endpoint = 'http://example.com';

const mockResponse = {
    'results': [
        {
            'serialNumber': '57192858',
            'unitType': 'SUNKING',
            'keyCode': '154 453 334 424 422',
            'keyCodeType': 'UNLOCK',
            'expiry': 1621084752
        }
    ],
    'message': 'Fetched existing client unit',
    'status': 200
};
const mockResponseData = JSON.stringify(mockResponse);

describe('getCode', () => {
    let mockLogger;
    beforeEach(() => {
        mockLogger ={ error: jest.fn() };
        Log.mockReturnValue(mockLogger);
    });
    it('should be a function', () => {
        expect(getCode).toBeInstanceOf(Function);
    });
    it('should call Http.request', () => {
        getCode(mockRequestData);
        expect(httpClient.request).toHaveBeenCalledWith(
            `${service.vars.shs_reg_endpoint }/api/shs/v1/units?accountNumber=${mockRequestData.accountNumber}&countryCode=${mockRequestData.countryCode}`,
            {
                headers: {},
                method: 'GET'
            }
        );
    });

    it('should return the code if the request is succesful', () => {
        httpClient.request.mockReturnValueOnce({status: 200, content: mockResponseData});
        const result = getCode(mockRequestData);
        expect(result).toEqual(mockResponse.results);
    });
    it('should log an error when the response code is not 200', () => {
        const mockResponse = { status: 404, content: mockResponseData };
        httpClient.request.mockReturnValueOnce(mockResponse);
        getCode(mockRequestData);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to get shs unit', 
            {data: mockResponse}
        );
    });
    it('should return an null if the response code is 500', () => {
        httpClient.request.mockReturnValueOnce({status: 500, content: mockResponseData});
        const result = getCode(mockRequestData);
        expect(result).toEqual(null);
    });
    it('should log an error when the request throws an error', () => {
        const error = new Error ('Error occured');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        getCode(mockRequestData);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Error getting shs unit', 
            {data: error}
        );        
    });
    it('shoud return an false if the request throws an error', () => {
        httpClient.request.mockImplementationOnce(()=>{throw 'Error';});
        const result = getCode(mockRequestData);
        expect(result).toEqual(false);
    });
});