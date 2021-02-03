const pinMenuHandler = require('./pinMenuHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');
const scheduleCall = require('../../utils/scheduleCall');

jest.mock('../../../notifications/elk-notification/elkNotification');
jest.mock('../../utils/scheduleCall');

describe('Pin Menu Handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('prompts user to enter pin', () => {
        pinMenuHandler('1');

        expect(sayText).toHaveBeenCalledWith('Enter PIN');
        expect(promptDigits).toHaveBeenCalledWith('pin', {
            submitOnHash: true,
            maxDigits: 4,
            timeout: 5,
        });
    });

    it('schedules a call when user has forgotten pin', () => {
        global.contact = { phone_number: '07812345678' };
        pinMenuHandler('2');

        expect(scheduleCall).toHaveBeenCalledWith({
            lang: 'en',
            desc:
                'Call back requested for forgotten pin. User phone number is 07812345678',
            accountNumber: 'NonClient07812345678',
            phoneNumber: '07812345678',
            repeatMenu: 'pin_menu',
            repeatHandler: 'pin_menu',
            successMsg: 'OAF_call',
        });
    });

    it('goes back to the national ID menu when user chooses back', () => {
        pinMenuHandler('3');

        expect(sayText).toHaveBeenCalledWith('Enter my ID number');
        expect(promptDigits).toHaveBeenCalledWith('national_id', {
            submitOnHash: true,
            maxDigits: 8,
            timeout: 5,
        });
    });

    it('stays on the menu when user chooses an invalid option', () => {
        pinMenuHandler('99');

        expect(sayText).toHaveBeenCalledWith(
            'Enter your PIN\n1) Enter PIN\n2) I forgot my PIN\n3) Back'
        );
        expect(promptDigits).toHaveBeenCalledWith('pin_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
    });

    it('should call notifyELK', () => {
        pinMenuHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
});
