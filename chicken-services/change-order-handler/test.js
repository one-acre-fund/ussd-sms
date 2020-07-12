const {handlerName,getHandler} = require ('.');

const mockClientName = [{FirstName: 'hello'}];
const mockResponseName = JSON.stringify(mockClientName);

describe('change_order_handler', () => {
    var changeOrderHandler;
    var onPaymentValidated;
    const minimum_amount_paid = true;
    var name = 'hello';
    var number = 10;
    beforeEach(() => {
        sayText.mockReset();
        JSON.parse = jest.fn();
        onPaymentValidated = jest.fn();
        state.vars.minimum_amount_paid = minimum_amount_paid;
        state.vars.client_json = mockResponseName;
        state.vars.chcken_nber = number;
        changeOrderHandler = getHandler(onPaymentValidated);
        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return {FirstName: name};
        });
        
    });
    it('should be a function', () => {
        expect(changeOrderHandler).toBeInstanceOf(Function);
    });
    it('should show a message saying they don\'t meet requirements if repayment is small', () => {
        project.vars.lang = 'en';
        state.vars.minimum_amount_paid = false;
        changeOrderHandler('1');
        expect(sayText).toHaveBeenCalledWith('Sorry, you have not reached your minimum prepayment amount to confirm chickens. Please complete your prepayment if you want to confirm them.');
    });
    it('should not show a message saying they don\'t meet requirements if repayment requirement is met', () => {
        project.vars.lang = 'en';
        state.vars.minimum_amount_paid = true;
        changeOrderHandler('1');
        expect(sayText).not.toHaveBeenCalled();
    });
    it('should show a message for retry if is not zero or one', () => {
        project.vars.lang = 'en';
        changeOrderHandler('7');
        expect(sayText).toHaveBeenCalledWith(`Hello ${name} `
        + `You have already confirmed ${number} `+
        'number of chicken. 1: Change confirmation 0: Return home');
    });
    it('should show prompt for re-entry if unexpected input', () => {
        project.vars.lang = 'en';
        changeOrderHandler('7');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call the onPaymentValidated handler if the repayment is satisfied', () => {
        changeOrderHandler('1');
        state.vars.minimum_amount_paid = true;
        expect(onPaymentValidated).toBeCalled();
    });

});
