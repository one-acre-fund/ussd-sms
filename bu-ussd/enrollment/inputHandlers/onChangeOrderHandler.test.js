const onChangeOrderHandler = require('./onChangeOrderHandler');
const confirmOrder = require('../utils/confirmOrder');

jest.mock('../utils/confirmOrder');

describe('on change order handler', () => {
    beforeAll(() => {
        state.vars.ordered_bundles_screens = JSON.stringify({'1': 'screen1', '2': 'screen2', '3': 'screen3'});
        state.vars.ordered_bundles_option_values =  JSON.stringify({'1': '123', '2': '345', '3': '567'});
        state.vars.current_ordered_bundles_screen = '1';
    });

    it('should reprompt when user provides no input', () => {
        const onRemoveProductSelected = jest.fn();
        const handler = onChangeOrderHandler.getHandler('en-bu', onRemoveProductSelected);
        handler();
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(onChangeOrderHandler.handlerName);
    });
    
    it('should call confirm order if user enters 0', () => {
        const onRemoveProductSelected = jest.fn();
        const handler = onChangeOrderHandler.getHandler('en-bu', onRemoveProductSelected);
        handler('0');
        expect(confirmOrder).toHaveBeenCalledWith('en-bu');
    });

    it('should reprompt when user invalid input', () => {
        const onRemoveProductSelected = jest.fn();
        const handler = onChangeOrderHandler.getHandler('en-bu', onRemoveProductSelected);
        handler('003643sda6d!');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(onChangeOrderHandler.handlerName);
    });

    it('should show the next screen if the user enters 77', () => {
        const onRemoveProductSelected = jest.fn();
        const handler = onChangeOrderHandler.getHandler('en-bu', onRemoveProductSelected);
        handler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(state.vars.current_ordered_bundles_screen).toEqual(2);
        expect(promptDigits).toHaveBeenCalledWith(onChangeOrderHandler.handlerName);
    });

    it('should call onRemoveSelected and reprompt for a product once the user chooses a valid product', () => {
        const onRemoveProductSelected = jest.fn();
        const handler = onChangeOrderHandler.getHandler('en-bu', onRemoveProductSelected);
        handler('1');
        expect(onRemoveProductSelected).toHaveBeenCalledWith('en-bu', '123');
        expect(promptDigits).toHaveBeenCalledWith(onChangeOrderHandler.handlerName);
    });
});