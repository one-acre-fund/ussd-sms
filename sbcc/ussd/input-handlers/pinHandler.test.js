const pinHandler = require('./pinHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

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

    it('displays nutrition hotline number for user to call if incorrect pin attempt has exceeded max', () => {
        state.vars.incorrectPinAttempts = 2;

        pinHandler('2123');

        expect(state.vars.incorrectPinAttempts).toEqual(3);
        expect(sayText).toHaveBeenCalledWith(
            'We\'re sorry there\'s a problem with your PIN. Please call our nutrition hotline number 0800720958 free of charge, to get assistance from our Customer Engagement Agents.'
        );
    });

    it('sets the user preferred language and calls the IVR service if correct pin is entered', () => {
        contact.phone_number = '07812345678';
        state.vars.pin = '1234';

        pinHandler('1234');

        expect(contact.vars.sbccLang).toEqual('en');
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
