const changeGroupNameApi = require('./changeGroupNameApi');
const logger = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');
describe('change group name api', () => {
    let mockLogger;
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        logger.mockReturnValue(mockLogger);
    });
    it('it should change group name successfully', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content});
        const result = changeGroupNameApi({AccountNumber: '12423598'});
        expect(result).toEqual({});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 400, content});
        changeGroupNameApi({AccountNumber: '12423598'});
        expect(mockLogger.error).toHaveBeenCalledWith('Error while changing group name', {'data': '{"status":400,"content":"{}"}'});
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content: {}});
        changeGroupNameApi({AccountNumber: '12423598'});
        expect(mockLogger.error).toHaveBeenCalledWith('API Error while changing group name', {'data': '{}'});
    });
});
