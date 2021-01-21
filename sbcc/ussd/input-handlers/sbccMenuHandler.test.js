const sbccMenuHandler = require('./sbccMenuHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');
const scheduleCall = require('../../utils/scheduleCall');

jest.mock('../../../notifications/elk-notification/elkNotification');
jest.mock('../../utils/scheduleCall');

describe('SBCC menu handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const mockBackMenu = jest.fn();
    const handler = sbccMenuHandler.getHandler(mockBackMenu);

    it('prompts user to enter national ID', () => {
        handler('1');
        expect(sayText).toHaveBeenCalledWith('Enter my ID number');
        expect(promptDigits).toHaveBeenCalledWith('national_id', {
            submitOnHash: true,
            maxDigits: 8,
            timeout: 5,
        });
    });

    it('schedules a call when user has forgotten national ID', () => {
        global.contact = { phone_number: '07812345678' };
        handler('2');

        expect(scheduleCall).toHaveBeenCalledWith({
            lang: 'en',
            desc:
                'Call back requested for forgotten national ID. User phone number is 07812345678',
            accountNumber: 'NonClient07812345678',
            phoneNumber: '07812345678',
            repeatMenu: 'sbcc_menu',
            repeatHandler: 'sbcc_menu',
            successMsg: 'OAF_call',
        });
    });

    it('goes back to the non client menu when user chooses back', () => {
        handler('3');
        expect(mockBackMenu).toHaveBeenCalled();
        expect(promptDigits).toHaveBeenCalledWith('NonClientMenu', {
            submitOnHash: true,
            maxDigits: 2,
            timeout: 5,
        });
    });

    it('stays on the menu when user chooses an invalid option', () => {
        handler('79');
        expect(sayText).toHaveBeenCalledWith(
            'Enter your national ID number\n1) Enter my ID number\n2) I forgot my National ID number\n3) Back'
        );
        expect(promptDigits).toHaveBeenCalledWith('sbcc_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
    });

    it('should call notifyELK', () => {
        handler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
});
