const nextScreenBalance = require('./nextScreenBalance');
describe('next screen', () => {
    beforeAll(() => {
        state.vars.balance_screens = JSON.stringify({1: 'screen1\n', 2: 'screen2\n'});
        state.vars.current_season_balance = '1';
        contact.phone_number = '0780456374';
    });

    it('should reprompt if the input is invalid', () => {
        const handler = nextScreenBalance.getHandler('en-mw');
        handler('823');
        expect(sayText).toHaveBeenCalledWith('screen1\n' +
        '1) Next Season\n' +
        '2) Send to me via SMS');
        expect(promptDigits).toHaveBeenCalledWith(nextScreenBalance.handlerName);
    });
    it('should reprompt and go to the next screen', () => {
        const handler = nextScreenBalance.getHandler('en-mw');
        handler('1');
        expect(sayText).toHaveBeenCalledWith('screen2\n' +
        '1) Next Season\n' +
        '2) Send to me via SMS');
        expect(promptDigits).toHaveBeenCalledWith(nextScreenBalance.handlerName);
    });
    it('should send an sms and end session if client chooses 2', () => {
        const handler = nextScreenBalance.getHandler('en-mw');
        handler('2');
        expect(sendMessage).toHaveBeenCalledWith({'content': 'screen2\n', 'to_number': '0780456374'});
        expect(stopRules).toHaveBeenCalled();
    });
});
