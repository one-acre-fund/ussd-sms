const {handlerName, getHandler} = require('./serialNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var rosterAPI = require('../../rw-legacy/lib/roster/api');

jest.mock('../../rw-legacy/lib/roster/api');
jest.mock('../../notifications/elk-notification/elkNotification');
describe('serial_number_handler', () => {
    var serialNumberHandler;
    var onSerialNumberReceived;
    var validSerialNumber = '123456789';
    beforeAll(() => {
        rosterAPI.getProductExpirationInfo = jest.fn();
        rosterAPI.getProductExpirationInfo.mockReturnValue({});
    });
    beforeEach(() => {
        sayText.mockReset();
        onSerialNumberReceived = jest.fn();
        serialNumberHandler = getHandler(onSerialNumberReceived);
        rosterAPI.getProductExpirationInfo = jest.fn();
        state.vars.exp_lang = 'en-ke';
        state.vars.account = '12345678';
    });
    it('should call notifyELK ', () => {
        serialNumberHandler(validSerialNumber);
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should  call onSerialNumberReceived if the serial number is provided', () => {
        rosterAPI.getProductExpirationInfo.mockReturnValueOnce({});
        serialNumberHandler(validSerialNumber);
        expect(onSerialNumberReceived).toHaveBeenCalled();
    });
    it('should not call onSerialNumberReceived if serial number is not provided', () => {
        rosterAPI.getProductExpirationInfo.mockReturnValueOnce({});
        serialNumberHandler('');
        expect(onSerialNumberReceived).not.toHaveBeenCalled();
    });
    it('should prompt for retry if a serial number is not provided', () => {
        rosterAPI.getClient.mockReturnValueOnce(false);
        serialNumberHandler('');
        expect(sayText).toHaveBeenCalledWith('Enter the Serial number of your Product');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
});
