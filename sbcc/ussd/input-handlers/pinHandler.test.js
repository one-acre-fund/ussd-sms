const pinHandler = require('./pinHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');
const scheduleCall = require('../../utils/scheduleCall');

jest.mock('../../../notifications/elk-notification/elkNotification');
jest.mock('../../utils/scheduleCall');

describe('Pin Handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('asks user to try again if incorrect pin is entered once', () => {
        pinHandler('2123');

        expect(state.vars.incorrectPinAttempts).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Please try again');
        expect(promptDigits).toHaveBeenCalledWith('pin', {
            submitOnHash: true,
            maxDigits: 4,
            timeout: 5,
        });
    });

    it('schedules a call back if incorrect pin is entered twice', () => {
        state.vars.incorrectPinAttempts = 2;
        contact.phone_number = '07812345678';

        pinHandler('2123');

        expect(state.vars.incorrectPinAttempts).toEqual(3);
        expect(scheduleCall).toHaveBeenCalledWith({
            lang: 'en',
            desc:
                'Call back requested for incorrect pin entered twice. User phone number is 07812345678',
            accountNumber: 'NonClient07812345678',
            phoneNumber: '07812345678',
            repeatMenu: 'try_again',
            repeatHandler: 'pin',
            successMsg: 'incorrect_pin',
        });
    });

    it('sets the user preferred language and calls the IVR service if correct pin is entered', () => {
        contact.phone_number = '07812345678';
        state.vars.pin = '1234';

        pinHandler('1234');

        expect(contact.vars.lang).toEqual('en');
        expect(project.sendMessage).toHaveBeenCalledWith({
            message_type: 'call',
            service_id: 'SV535e0ec81dc27e51',
            to_number: '07812345678',
            route_id: 'PN54d237477649c512',
        });
    });

    it('should call notifyELK', () => {
        pinHandler('2143');
        expect(notifyELK).toHaveBeenCalled();
    });
});
