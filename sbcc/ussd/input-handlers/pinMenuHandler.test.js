const pinMenuHandler = require('./pinMenuHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

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

    it('displays nutrition hotline number for user to call when pin is forgotten', () => {
        pinMenuHandler('2');

        expect(sayText).toHaveBeenCalledWith(
            'We\'re sorry there\'s a problem with your PIN. Please call our nutrition hotline number 0800720958 free of charge, to get assistance from our Customer Engagement Agents.'
        );
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
