const accountNumberHandler = require('./account-number-handler/accountNumberHandler');
const justInTime = require('./justInTime');
var {client}  = require('../client-enrollment/test-client-data');
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./account-number-handler/accountNumberHandler');

const mockAccountNumberHandler = jest.fn();

const account = 123456789;
const country = 'KE';
const jitLang = 'en-ke';

describe('clientRegistration', () => {

    it('should have a start function', () => {
        expect(justInTime.start).toBeInstanceOf(Function);
    });
    beforeAll(()=>{
        state.vars.jitLang = jitLang;
        state.vars.topUpClient = JSON.stringify(client);
    });
    beforeEach(() => {
        accountNumberHandler.getHandler.mockReturnValue(mockAccountNumberHandler);

    });
    it('should add the account number handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(accountNumberHandler.handlerName, accountNumberHandler.getHandler());            
    });
    describe('Account number handler success callback', () => {
        var callback;
        beforeEach(() => {
            justInTime.registerHandlers();
            callback = accountNumberHandler.getHandler.mock.calls[0][0];                
        });
        // xit('should not display a message saying that the prepayment is not one if the prepayment consition is not met',()=>{
        //     callback();
        //     expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
        // });
        // xit('should display a message saying that the prepayment condition is not satified if the remaining loan is greater than 500', () => {
        //     client.BalanceHistory[0].TotalCredit = 5000;
        //     client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 0;
        //     var amount = 4500;
        //     state.vars.topUpClient = JSON.stringify(client);
        //     callback();
        //     expect(sayText).toHaveBeenCalledWith(`You do not qualify for a top up, pay at least ${amount}`+
        //     ' to qualify.');
        // });
    });

    describe('start', () => {
        it('should set the  state vars to match the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.jitLang = '';
            justInTime.start(account, country,jitLang);
            expect(state.vars).toMatchObject({account,country,jitLang});
        });
        it('should call notifyELK', () => {
            justInTime.start(account, country,jitLang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should show a message asking for the account number for the farmer to top up', () => {
            justInTime.start(account, country, jitLang);
            expect(sayText).toHaveBeenCalledWith('Please reply with the account number of the farmer who want to top-up.');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should prompt for the account number for the farmer to top up', () => {
            justInTime.start(account, country, jitLang);
            expect(promptDigits).toHaveBeenCalledWith(accountNumberHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
    });
});