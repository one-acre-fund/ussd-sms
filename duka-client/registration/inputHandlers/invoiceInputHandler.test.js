const invoiceIdInputHandler = require('./invoiceIdInputHandler');
const confirmInvoiceIdInputHandler = require('./confirmInvoiceIdInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe.each(['en-ke', 'sw'])('invoice id input handaler', (lang) => {
    it('should prompt the user for invoice id confirmation once the user adds the invoice id', () => {
        const handler = invoiceIdInputHandler.getHandler(lang);
        const message = {
            'sw': 'Uliingiza nambari ACD64K ya invoice. Ingiza\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.',
            'en-ke': 'You entered invoice ID ACD64K\n' +
            '1) To confirm\n' +
            '2) To try again.'
        };
        handler('ACD64K');
        expect(notifyElk).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_invoice_id).toEqual('ACD64K');
        expect(promptDigits).toHaveBeenCalledWith(confirmInvoiceIdInputHandler.handlerName);
    });
});
