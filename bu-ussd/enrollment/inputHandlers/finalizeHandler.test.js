const finalizeHandler = require('./finalizeHandler');
const onKeepOrdering = require('../utils/onKeepOrdering');
const onChangeOrder = require('../utils/onChangeOrder');
const confirmOrder = require('../utils/confirmOrder');

jest.mock('../utils/onKeepOrdering');
jest.mock('../utils/onChangeOrder');
jest.mock('../utils/confirmOrder');

describe('finalize handler', () => {
    beforeAll(() => {
        state.vars.finalize_screen = 'finalize screen';
    });
    it('should reprompt on empty input', () => {
        var handler = finalizeHandler.getHandler('en_bu');
        handler();
        expect(sayText).toHaveBeenCalledWith('finalize screen');
        expect(promptDigits).toHaveBeenCalledWith(finalizeHandler.handlerName);
    });
    it('should call onKeepOrdering once user chooses 1', () => {
        var handler = finalizeHandler.getHandler('en_bu');
        handler('1');
        expect(onKeepOrdering).toHaveBeenCalledWith('en_bu');
    });
    it('should call onChangeOrder once user chooses 2', () => {
        var handler = finalizeHandler.getHandler('en_bu');
        handler('2');
        expect(onChangeOrder).toHaveBeenCalledWith('en_bu');
    });
    it('should call confirmOrder once user chooses 3', () => {
        var handler = finalizeHandler.getHandler('en_bu');
        handler('3');
        expect(confirmOrder).toHaveBeenCalledWith('en_bu');
    });
});
