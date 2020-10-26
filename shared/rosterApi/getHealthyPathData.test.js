const getHealthyPath = require('./getHealthyPathData');
const logger = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

const mockResult = [{
    'EndDate': '2021-06-27T00:00:00',
    'StartDate': '2021-06-21T00:00:00',
    'HealthyPathTarget': 0.5500
},
{
    'EndDate': '2020-10-11T00:00:00',
    'StartDate': '2020-10-05T00:00:00',
    'HealthyPathTarget': 0.0400
},
{
    'EndDate': '2021-04-04T00:00:00',
    'StartDate': '2021-03-29T00:00:00',
    'HealthyPathTarget': 0.3450
}];

describe('get healthy path data', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    let mockLogger;
    beforeEach(() => {
        service.vars.server_name = 'http/example.com';
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        logger.mockReturnValue(mockLogger);
        jest.resetModules();
    });
    it('it should fetch healthy path data successfully', () => {
        const content = JSON.stringify(mockResult);
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content});
        const result = getHealthyPath(280, 834, 1834);
        expect(result).toEqual(mockResult);
        expect(httpClient.request).toHaveBeenCalledWith('http/example.com/Api/HealthyPath/HealthyPath?SeasonId=280&CountryId=834&DistrictId=1834', {'headers': {'Content-Type': 'application/json'}, 'method': 'GET'});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 400, content});
        const result = getHealthyPath(280, 834, 1834);
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while fetching healthy path data', {'data': '{"status":400,"content":"{}"}'});
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce(new Error('Error'));
        const result = getHealthyPath(280, 834, 1834);
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while fetching healthy path data', {'data': '{}'});
    });
});
