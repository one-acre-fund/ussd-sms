var rosterAPI = require('../../rw-legacy/lib/roster/api');
var Log = require('../../logger/elk/elk-logger');
var rosterColRequest = require('./rosterColRequest');

jest.mock('../../rw-legacy/lib/roster/api');
jest.mock('../../logger/elk/elk-logger');
jest.mock('../../notifications/elk-notification/elkNotification');

describe('collecting payment', () => {
    beforeAll(() => {
        jest.spyOn(PhoneNumber, 'formatInternationalRaw').mockImplementationOnce((param) => param);
    });

    it('should return success if the payment is successfully triggered', () => {
        jest.spyOn(rosterAPI, 'collectPayment').mockReturnValueOnce({Success: true});
        const response = rosterColRequest('12345678', 250, '0780567466');
        expect(response).toBeTruthy();
    });
    it('should return false if the payment is not successfully triggered', () => {
        var mockLogger = {
            error: jest.fn(),
        };
        Log.mockReturnValue(mockLogger);
        jest.spyOn(mockLogger, 'error');
        jest.spyOn(rosterAPI, 'collectPayment').mockReturnValueOnce({Success: false});
        const response = rosterColRequest('12345678', 250, '0780567466');
        expect(mockLogger.error).toHaveBeenCalledWith('KE USD Collection RequestKE USD Collection Request failed', {'data': {'Success': false}, 'tags': ['repayments']});
        expect(response).toBeFalsy();
    });
});