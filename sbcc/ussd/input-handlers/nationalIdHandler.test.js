const nationalIdHandler = require('./nationalIdHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');
const scheduleCall = require('../../utils/scheduleCall');

jest.mock('../../../notifications/elk-notification/elkNotification');
jest.mock('../../utils/scheduleCall');

describe('National ID handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const table = {queryRows: jest.fn()};

    it('goes to pin menu when correct national ID is entered', () => {
        const nationalIdRecord = {vars: {
            national_id: '12345678',
            pin: '0000'
        }};
        const cursor = {hasNext: jest.fn(() => true), next: jest.fn(() => nationalIdRecord)};
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        nationalIdHandler('12345678');

        expect(sayText).toHaveBeenCalledWith('Enter your PIN\n1) Enter PIN\n2) I forgot my PIN\n3) Back');
        expect(promptDigits).toHaveBeenCalledWith('pin_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
    });

    it('asks user to try again if incorrect ID is entered once', () => {
        const cursor = {hasNext: jest.fn(() => false)};
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

    it('schedules a call back if incorrect ID is entered twice', () => {
        const cursor = {hasNext: jest.fn(() => false)};
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        state.vars.incorrectIdAttempts = 2;
        contact.phone_number = '07812345678';

        nationalIdHandler('98796850');

        expect(state.vars.incorrectIdAttempts).toEqual(3);
        expect(scheduleCall).toHaveBeenCalledWith({
            lang: 'en',
            desc: 'Call back requested for incorrect national ID entered twice. User phone number is 07812345678',
            accountNumber: 'NonClient07812345678',
            phoneNumber: '07812345678', 
            repeatMenu: 'try_again',
            repeatHandler: 'national_id',
            successMsg: 'incorrect_id'
        });
    });

    it('resets number of incorrect attempts and goes to pin menu when correct national ID is entered after one incorrect attempt', () => {
        state.vars.incorrectIdAttempts = 1;
        const nationalIdRecord = {vars: {
            national_id: '12345678',
            pin: '0000'
        }};
        const cursor = {hasNext: jest.fn(() => true), next: jest.fn(() => nationalIdRecord)};
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        nationalIdHandler('12345678');

        expect(state.vars.incorrectIdAttempts).toEqual(0);
        expect(sayText).toHaveBeenCalledWith('Enter your PIN\n1) Enter PIN\n2) I forgot my PIN\n3) Back');
        expect(promptDigits).toHaveBeenCalledWith('pin_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
    });

    it('should call notifyELK',()=>{
        const cursor = {hasNext: jest.fn(() => false)};
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        
        nationalIdHandler('12345678');
        expect(notifyELK).toHaveBeenCalled();
    });
});