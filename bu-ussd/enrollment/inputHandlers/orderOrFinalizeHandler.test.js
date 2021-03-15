const orderOrFinalizeHandler = require('./orderOrFinalizeHandler');

describe('order or finalize input handler', () => {
    it('should reprompt on empty input', () => {
        const onOrderOrFinaliseSelected = jest.fn();
        const handler = orderOrFinalizeHandler.getHandler('en-bu', onOrderOrFinaliseSelected);
        handler();
        expect(sayText).toHaveBeenCalledWith('1) Continue ordering\n' +
        '2) Confirm and finalize');
        expect(promptDigits).toHaveBeenCalledWith(orderOrFinalizeHandler.handlerName);
    });
    it('should call onOrderOrFinaliseSelected if input is 1', () => {
        const onOrderOrFinaliseSelected = jest.fn();
        const handler = orderOrFinalizeHandler.getHandler('en-bu', onOrderOrFinaliseSelected);
        handler('1');
        expect(onOrderOrFinaliseSelected).toHaveBeenCalledWith('en-bu', '1');
    });
    it('should call onOrderOrFinaliseSelected if input is 2', () => {
        const onOrderOrFinaliseSelected = jest.fn();
        const handler = orderOrFinalizeHandler.getHandler('en-bu', onOrderOrFinaliseSelected);
        handler('2');
        expect(onOrderOrFinaliseSelected).toHaveBeenCalledWith('en-bu', '2');
    });
    it('should reprompt on invalid input', () => {
        const onOrderOrFinaliseSelected = jest.fn();
        const handler = orderOrFinalizeHandler.getHandler('en-bu', onOrderOrFinaliseSelected);
        handler('12bsuj8   ');
        expect(sayText).toHaveBeenCalledWith('1) Continue ordering\n' +
        '2) Confirm and finalize');
        expect(promptDigits).toHaveBeenCalledWith(orderOrFinalizeHandler.handlerName);
    });
}); 
