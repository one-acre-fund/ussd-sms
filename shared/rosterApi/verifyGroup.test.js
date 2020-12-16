var verifyGroup = require('./verifyGroup');
var logger = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

describe('Verify group on roster', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });
    let mockLogger;
    beforeEach(() => {
        service.vars.server_name = 'http/example.com';
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn(),
        };
        logger.mockReturnValue(mockLogger);
        jest.resetModules();
    });
    it('it should successfully return group name and active status', () => {
        const content = JSON.stringify({ 'Name': 'Abagirukuri', 'Active': true });
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({
            status: 200,
            content,
        });
        const result = verifyGroup(4646, 233, 4);
        expect(result).toEqual({ 'Name': 'Abagirukuri', 'Active': true });
    });
    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 404, content});
        const result = verifyGroup(1646, 32, -1);
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while verifying group', {'data': '{"status":404,"content":"{}"}'});
    });

    it('it should handle the unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce(new Error('Error'));
        const result = verifyGroup(2646, 372, 1556);
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while verifying group', {'data': '{}'});
    });
});
