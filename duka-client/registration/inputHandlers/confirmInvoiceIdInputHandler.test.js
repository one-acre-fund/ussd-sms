const invoiceIdInputHandler = require('./invoiceIdInputHandler');
const confirmFirstSecondName = require('./confirmFirstSecondNameInputHandler');
const confirmInvoiceInputHandler = require('./confirmInvoiceIdInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe.each(['en-ke', 'sw'])('confirm invoice input handler using (%s)', (lang) => {
    beforeEach(() => {
        state.vars = {};
    });

    it('should call the elk', () => {
        const handler = confirmInvoiceInputHandler.getHandler(lang);
        state.vars.duka_client_invoice_id = 'DTX009S';
        handler('00');
        expect(notifyElk).toHaveBeenCalled();
    });

    it('should reprompt for invoice confirmation when a user enters an invalid option --' + lang, () => {
        const handler = confirmInvoiceInputHandler.getHandler(lang);
        state.vars.duka_client_invoice_id = 'DTX009S';
        handler('00');
        const message = {
            'en-ke': 'You entered invoice ID DTX009S\n' +
            '1) To confirm\n' +
            '2) To try again.',
            'sw': 'Uliingiza nambari DTX009S ya invoice. Ingiza\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(confirmInvoiceInputHandler.handlerName);
    });

    it('should reprompt for invoice id when the user chooses 2 --' + lang, () => {
        const handler = confirmInvoiceInputHandler.getHandler(lang);
        handler(2);
        const message = {
            'en-ke': 'Please reply with the client\'s Erply Invoice ID',
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(invoiceIdInputHandler.handlerName);
    });

    it('should prompt for enrollment confirmation once the user chooses 1 and is a new client --' + lang, () => {
        const handler = confirmInvoiceInputHandler.getHandler(lang);
        state.vars.duka_client_first_name = 'Jamie';
        state.vars.duka_client_second_name = 'Fox';
        handler(1);
        const message = {
            'en-ke': 'Enroll client Jamie Fox\n' +
            '1) To confirm\n' +
            '2) To try again.',
            'sw': 'Sajili mteja Jamie Fox\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(confirmFirstSecondName.handlerName);
    });

    it('should save the user details once the user chooses 1 and is an existing client --' + lang, () => {
        const handler = confirmInvoiceInputHandler.getHandler(lang);
        const mockRow = {save: jest.fn()};
        const mockTable = {createRow: jest.fn(() => mockRow)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockTable);
        handler(1);
        const message = {
            'en-ke': 'You have successfully recorded your transaction.',
            'sw': 'Umekamilisha mafanikio ya ununuzi wako.'
        };
        expect(mockRow.save).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(stopRules).toHaveBeenCalled();
    });
});
