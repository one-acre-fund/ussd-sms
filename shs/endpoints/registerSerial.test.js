const registerSerial = require('./registerSerial');
const Log = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

const mockRequestData = {'accountNumber': '24450523','countryCode': '404','unitSerialNumber': '57192858','keyCodeType': 'ACTIVATION'};
service.vars.shs_reg_endpoint = 'http://example.com';

const mockResponse = {
    'results': [
        {
            'unitType': 'SUNKING',
            'keyCode': '125 245 523 424 254',
            'keyCodeType': 'ACTIVATION',
            'serialNumber': '57192650',
            'expiry': 1621156477
        }
    ],
    'message': 'Fetched existing client unit from database',
    'status': 200
};
const mockBadSerialResponse = {'message': 'No unit found with serial number 57192858','status': 404};
const mockOtherSerialResponse = {'message': 'Unit with serial number 57192858 assigned to another client','status': 404};
const sysErrorResponse = {'message': 'Unit with serial number 57192858  assigned to another client','status': 500};
const mockResponseData = JSON.stringify(mockResponse);
var mockBadSerialResponseData = JSON.stringify(mockBadSerialResponse);

describe('register serial', () => {
    let mockLogger;
    beforeEach(() => {
        mockLogger ={ error: jest.fn() };
        Log.mockReturnValue(mockLogger);
    });
    it('should be a function', () => {
        expect(registerSerial).toBeInstanceOf(Function);
    });
    it('should call Http.request', () => {
        registerSerial(mockRequestData);
        expect(httpClient.request).toHaveBeenCalledWith(
            `${service.vars.shs_reg_endpoint }/api/services/shs/v1/units/register`,
            {
                headers: {},
                method: 'POST',
                data: mockRequestData
            }
        );
    });

    it('should return shs information if the request is succesful', () => {
        httpClient.request.mockReturnValueOnce({status: 200, content: mockResponseData});
        const result = registerSerial(mockRequestData);
        expect(result).toEqual(mockResponse.results);
    });
    it('should log an error when the response code is not 200', () => {
        const mockResponse = { status: 404, content: mockResponseData };
        httpClient.request.mockReturnValueOnce(mockResponse);
        registerSerial(mockRequestData);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to register shs unit', 
            {data: mockResponse}
        );
    });
    it('should return an null if the response code is 500', () => {
        httpClient.request.mockReturnValueOnce({status: 500, content: mockResponseData});
        const result = registerSerial(mockRequestData);
        expect(result).toEqual(null);
    });
    it('should log an error when the request throws an error', () => {
        const error = new Error ('Error occured');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        registerSerial(mockRequestData);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Error registering shs unit', 
            {data: error}
        );        
    });
    it('shoud return wrong serial if the serial number is not recognized', () => {
        httpClient.request.mockReturnValueOnce({status: 404, content: mockBadSerialResponseData});
        const result = registerSerial(mockRequestData);
        expect(result).toEqual('wrong serial');
    });
    it('shoud return wrong serial if the serial number is not recognized', () => {
        var mockBadSerialResponseData = JSON.stringify(mockOtherSerialResponse);
        httpClient.request.mockReturnValueOnce({status: 404, content: mockBadSerialResponseData});
        const result = registerSerial(mockRequestData);
        expect(sayText).toHaveBeenCalledWith('The serial Number 57192858 is assigned to another person');
        expect(result).toEqual(null);
    });
    it('shoud return wrong serial if the serial number is not recognized', () => {
        var mockBadResponseData = JSON.stringify(sysErrorResponse);
        httpClient.request.mockReturnValueOnce({status: 500, content: mockBadResponseData});
        const result = registerSerial(mockRequestData);
        expect(sayText).toHaveBeenCalledWith('There is a system error. please try again later');
        expect(result).toEqual(null);
    });
});