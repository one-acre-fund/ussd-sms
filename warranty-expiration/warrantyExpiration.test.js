const serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
const warrantyExpiration = require('./warrantyExpiration');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var getProductExpirationInfo = require('../shared/rosterApi/getProductExpirationInfo');

jest.mock('../shared/rosterApi/getProductExpirationInfo');
jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./serial-number-handler/serialNumberHandler');
jest.mock('../shared/rosterApi/getProductExpirationInfo');

const mockSerialNumberHandler = jest.fn();
const mockUnexpired = {
    date: '23 September 2030',
    expired: false
};
const mockExpired = {
    date: '23 September 2020',
    expired: true
};
const globalClientID = '46457403-be20-4319-a242-115b6415fe79';
const serialNumber = 12345678;
const exp_lang = 'en-ke';
state.vars.exp_lang = 'en-ke';

describe('warrantyExpiration', () => {

    it('should have a start function', () => {
        expect(warrantyExpiration.start).toBeInstanceOf(Function);
    });
    beforeAll(() => {
        state.vars.exp_lang = exp_lang;
    });
    beforeEach(() => {
        serialNumberHandler.getHandler.mockReturnValue(mockSerialNumberHandler);
    });
    it('should register the serial number handler to input handlers', () => {
        warrantyExpiration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(serialNumberHandler.handlerName, serialNumberHandler.getHandler());
    });

    describe('add Serial Number Handler successful callback', () => {
        var callback;
        beforeEach(() => {
            warrantyExpiration.registerHandlers();
            callback = serialNumberHandler.getHandler.mock.calls[0][0];
        });
        it('should show the valid message for unexpired warranty', () => {
            getProductExpirationInfo.mockImplementation(() => {
                return mockUnexpired;
            });
            callback(serialNumber);
            expect(sayText).toHaveBeenCalledWith(`Product expires ${mockUnexpired.date}\n`);
        });
        it('should show the valid message for expired warranty', () => {
            getProductExpirationInfo.mockImplementation(() => {
                return mockExpired;
            });
            callback(serialNumber);
            expect(sayText).toHaveBeenCalledWith(`Product expires ${mockExpired.date}\n`);
        });
        it('should show the valid message when get expiration failed', () => {
            getProductExpirationInfo.mockImplementation(() => {
                return;
            });
            callback(serialNumber);
            expect(sayText).toHaveBeenCalledWith('You are not registered to this product serial number\n');
        });
    });

    describe('start', () => {
        it('should set the state vars to match the provided account and language', () => {
            state.vars.account = '';
            state.vars.exp_lang = '';
            warrantyExpiration.start(globalClientID, exp_lang);
            expect(state.vars).toMatchObject({clientID: globalClientID, exp_lang: exp_lang});
        });
        it('should call notifyELK', () => {
            warrantyExpiration.start(globalClientID, exp_lang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should show a message asking for the serial number', () => {
            warrantyExpiration.start(globalClientID, exp_lang);
            expect(sayText).toHaveBeenCalledWith('Enter the Serial number of your Product');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should prompt for the serial number', () => {
            warrantyExpiration.start(globalClientID, exp_lang);
            expect(promptDigits).toHaveBeenCalledWith(serialNumberHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
    });
});
