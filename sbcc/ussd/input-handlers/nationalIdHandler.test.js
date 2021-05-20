const nationalIdHandler = require('./nationalIdHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('National ID handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const table = { queryRows: jest.fn() };

    it('goes to pin menu when correct national ID is entered', () => {
        const nationalIdRecord = {
            vars: {
                national_id: '12345678',
                pin: '0000',
                age: '45',
                gender: 'f'
            },
        };
        const cursor = {
            hasNext: jest.fn(() => true),
            next: jest.fn(() => nationalIdRecord),
        };
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        nationalIdHandler('12345678');

        expect(contact.vars.sbccAge).toEqual('45');
        expect(contact.vars.sbccGender).toEqual('f');
        expect(state.vars.pin).toEqual('0000');
        expect(sayText).toHaveBeenCalledWith(
            'Enter your PIN\n1) Enter PIN\n2) I forgot my PIN\n3) Back'
        );
        expect(promptDigits).toHaveBeenCalledWith('pin_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
    });

    it('asks user to try again if incorrect ID is entered once', () => {
        const cursor = { hasNext: jest.fn(() => false) };
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        nationalIdHandler('98796850');

        expect(state.vars.incorrectIdAttempts).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Please try again');
        expect(promptDigits).toHaveBeenCalledWith('national_id', {
            submitOnHash: true,
            maxDigits: 8,
            timeout: 5,
        });
    });

    it('displays nutrition hotline number for user to call if incorrect national ID attempt has exceeded max', () => {
        const cursor = { hasNext: jest.fn(() => false) };
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        state.vars.incorrectIdAttempts = 2;

        nationalIdHandler('98796850');

        expect(state.vars.incorrectIdAttempts).toEqual(3);
        expect(sayText).toHaveBeenCalledWith(
            'We\'re sorry there\'s a problem with your National ID. Please call our nutrition hotline number 0800720958 free of charge, to get assistance from our Customer Engagement Agents.'
        );
    });

    it('resets number of incorrect attempts and goes to pin menu when correct national ID is entered after one incorrect attempt', () => {
        state.vars.incorrectIdAttempts = 1;
        const nationalIdRecord = {
            vars: {
                national_id: '12345678',
                pin: '0000',
            },
        };
        const cursor = {
            hasNext: jest.fn(() => true),
            next: jest.fn(() => nationalIdRecord),
        };
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        nationalIdHandler('12345678');

        expect(state.vars.incorrectIdAttempts).toEqual(0);
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
        const cursor = { hasNext: jest.fn(() => false) };
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        nationalIdHandler('12345678');
        expect(notifyELK).toHaveBeenCalled();
    });
});
