var Log = require('../../logger/elk/elk-logger');
jest.mock('../../logger/elk/elk-logger');

describe('Log SMS error', () => {
    let mockLogger;
    beforeEach(() => {
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        Log.mockReturnValue(mockLogger);
    });
    it('should  log the error message', () => {
        require('./logMessageFailure');
        expect(mockLogger.error).toHaveBeenCalled();
    });
});