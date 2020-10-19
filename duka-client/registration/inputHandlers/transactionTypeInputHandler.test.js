const transactionTypeInputHandler = require('./transactionTypeInputHandler');
const invoiceIdInputHandler = require('./invoiceIdInputHandler');

describe.each(['en-ke', 'sw'])('Transaction type Input handler using (%s)', (lang) => {
    it('should set a transaction type to credit and prompt for invoice number if the user chooses 1 --' + lang, () => {
        const handler = transactionTypeInputHandler.getHandler(lang);
        handler(1);
        const messages = {
            'en-ke': 'Please reply with the client\'s Erply Invoice ID',
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice'
        };
        expect(state.vars.transaction_type).toEqual('Credit');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(invoiceIdInputHandler.handlerName);
    });

    it('should set a transaction type to Layaway and prompt for invoice number if the user chooses 2 --' + lang, () => {
        const handler = transactionTypeInputHandler.getHandler(lang);
        handler(2);
        const messages = {
            'en-ke': 'Please reply with the client\'s Erply Invoice ID',
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice'
        };
        expect(state.vars.transaction_type).toEqual('Layaway');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(invoiceIdInputHandler.handlerName);
    });

    it('should reprompt the user for transaction type if the response is not 1 or 2 --' + lang, () => {
        const handler = transactionTypeInputHandler.getHandler(lang);
        handler('gucci');
        const messages = {
            'en-ke': 'Is this a credit or layaway transaction?\n1) Credit\n2) Layaway',
            'sw': 'Je hii ni shughuli ya mkopo wa Credit au Layaway?\n1) Credit\n2) Layaway'
        };
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(transactionTypeInputHandler.handlerName);
    });
});