const checkClient = require('./checkAccountNumberByNid');
const logger = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

const nid = '1198234323432343';
const cid = 654;
describe('check account number by national id', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
        service.vars.roster_read_key = 'roster-api-read-key';
    });
    let mockLogger;
    beforeEach(() => {
        service.vars.server_name = 'http/example.com';
        mockLogger = {
            error: jest.fn(),
        };
        logger.mockReturnValue(mockLogger);
        jest.resetModules();
    });
    it('it should fetch client successfully', () => {
        const content = JSON.stringify({AccountNumber: '12453423'});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content});
        const result = checkClient(nid, cid);
        expect(result).toEqual({'AccountNumber': '12453423'});
        expect(httpClient.request).toHaveBeenCalledWith('http/example.com/api/sms/client?nationalId=1198234323432343&countryCode=654',
            {'headers': {'Authorization': 'Token roster-api-read-key', 'Content-Type': 'application/json'}, 'method': 'GET'});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 400, content});
        const result = checkClient(nid, cid);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while fetching client acccount', {'data': '{"status":400,"content":"{}"}'});
        expect(result).toEqual(undefined);
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce();
        const result = checkClient(nid, cid);
        expect(mockLogger.error).toHaveBeenCalledWith('API Error while fetching client account', {'data': '{}'});
        expect(result).toEqual(undefined);
    });
});
