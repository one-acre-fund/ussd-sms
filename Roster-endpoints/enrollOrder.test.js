var enrollOrder = require('./enrollOrder');
var Log = require('../logger/elk/elk-logger');

jest.mock('../logger/elk/elk-logger');

var mockResponse = {status: 201};
//const mockRequestData = {'districtId': 1245, 'siteId': 78};
//var mockUrl = 'http/example.com/api/USSDEnrollment/Enrollment/';
describe('enroll order test',()=>{

    let mockLogger;
    beforeEach(()=>{
        service.vars.server_name = 'http/example.com';
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        Log.mockReturnValue(mockLogger);
    });

    it('should be a function',()=>{
        expect(enrollOrder).toBeInstanceOf(Function);
    });
    it('should return true if the response is 201',()=>{
        httpClient.request.mockReturnValueOnce(mockResponse);
        var result = enrollOrder();
        expect(result).toBeTruthy();
    });
    it('should return false if the response is not 201',()=>{
        httpClient.request.mockReturnValueOnce({status: 409});
        var result = enrollOrder();
        expect(result).toBeFalsy();
    });
    it('should log a warning  if the response is not 201',()=>{
        var mockBadResponse = {status: 409};
        httpClient.request.mockReturnValueOnce(mockBadResponse);
        enrollOrder();
        expect(mockLogger.warn).toHaveBeenCalledWith('Failed to enroll ', { data: mockBadResponse});
    });
    it('should log the error if an error occurs',()=>{
        const error = new Error('Failed to enroll');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        enrollOrder();
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to enroll',{ data: error});
    });


});