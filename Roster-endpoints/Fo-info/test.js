
const getFoInfo = require('./getFoInfo');
const slack = require('../../slack-logger/index');
jest.mock('../../slack-logger');

const mockResult = {
    'firstName': 'sabin',
    'lastName': 'sheja',
    'phoneNumber': '0786182098'
};
const mockRequestData = {'districtId': 1245, 'siteId': 78};
service.vars.server_name = 'http://example.com';
service.vars.roster_api_key = 'some-api-key';

describe('getFoInfo', () => {
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
    it('should call slack when the response code is not 200', () => {
        httpClient.request.mockReturnValueOnce({status: 404, content: mockResult});
        getFoInfo(mockRequestData.districtId,mockRequestData.siteId);
        expect(slack.log).toHaveBeenCalled();
    });
    it('should slack when the request throws an error', () => {
        httpClient.request.mockImplementationOnce(()=>{throw 'Error fetching FO info';});
        slack.log.mockClear();
        getFoInfo(mockRequestData.districtId,mockRequestData.siteId);
        expect(slack.log).toHaveBeenCalledWith(expect.stringContaining('Failed to get Fo info: '));        
    });
});