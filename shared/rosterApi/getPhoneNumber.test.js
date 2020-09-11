const getPhoneNumber = require('./getPhoneNumber');
var logger = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

describe('Fetch Phone Number', () => {
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
    it('it should fetch phone number successfully', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content});
        const result = getPhoneNumber('27362ad-adf4-2fa-sdf2-2');
        expect(result).toEqual({});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 400, content});
        const result = getPhoneNumber('27362ad-adf4-2fa-sdf2-2');
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while fetching client phone number', {'data': '{"status":400,"content":"{}"}'});
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce(new Error('Error'));
        const result = getPhoneNumber('27362ad-adf4-2fa-sdf2-2');
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while fetching client phone number', {'data': '{}'});
    });
});
