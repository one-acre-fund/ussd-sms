const getProductExpirationInfo = require('./getProductExpirationInfo');
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
    it('it should getting product exipiration info successfully', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content});
        const result = getProductExpirationInfo('27362ad-adf4-2fa-sdf2-2', 'ccb18573e6de');
        expect(result).toEqual({});
    });

    it('it should handle the http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 400, content});
        const result = getProductExpirationInfo('27362ad-adf4-2fa-sdf2-2', 'ccb18573e6de');
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while getting product expiration info', {'data': '{"status":400,"content":"{}"}'});
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce(new Error('Error'));
        const result = getProductExpirationInfo('27362ad-adf4-2fa-sdf2-2','ccb18573e6de');
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while getting product expiration info', {'data': '{}'});
    });
});
