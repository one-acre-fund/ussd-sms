
const getFoInfo = require('./getFoInfo');
const Log = require('../../logger/elk/elk-logger');
jest.mock('../../logger/elk/elk-logger');

const mockResult = {
    'firstName': 'sabin',
    'lastName': 'sheja',
    'phoneNumber': '0786182098'
};
const mockRequestData = {'districtId': 1245, 'siteId': 78};
service.vars.server_name = 'http://example.com';
service.vars.roster_api_key = 'some-api-key';

describe('getFoInfo', () => {
    let mockLogger;
    beforeEach(() => {
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        Log.mockReturnValue(mockLogger);
    });
    it('should be a function', () => {
        expect(getFoInfo).toBeInstanceOf(Function);
    });
    it('should call Http.request', () => {
        getFoInfo(mockRequestData.districtId,mockRequestData.siteId);
        expect(httpClient.request).toHaveBeenCalledWith(
            `${service.vars.server_name }/Api/FieldOfficer/Get/?districtId=${mockRequestData.districtId}&siteId=${mockRequestData.siteId}`,
            {
                headers: { 'Authorization': `Token ${service.vars.roster_api_key}` },
                method: 'GET'
            }
        );
    });
    it('should return Fo info if the request is succesful', () => {
        httpClient.request.mockReturnValueOnce({status: 200, content: mockResult});
        const result = getFoInfo(mockRequestData.districtId,mockRequestData.siteId);
        expect(result).toEqual(mockResult);
    });
    it('should log a warning when the response code is not 200', () => {
        const mockResponse = { status: 404, content: mockResult };
        httpClient.request.mockReturnValueOnce(mockResponse);
        getFoInfo(mockRequestData.districtId,mockRequestData.siteId);
        expect(mockLogger.warn).toHaveBeenCalledWith('Failed to get Fo info',{data: mockResponse});
    });
    it('should an error when the request throws an error', () => {
        const error = new Error('Error fetching FO info');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        getFoInfo(mockRequestData.districtId,mockRequestData.siteId);
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to get Fo info', {data: error});
    });
});