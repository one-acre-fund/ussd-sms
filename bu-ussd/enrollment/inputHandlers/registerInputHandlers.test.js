const registerInputHandlers = require('./registerInputHandlers');

// handlers
const bundleInputHandler = require('./bundleInputsHandler');
const bundlesHandler = require('./bundlesHandler');
const finalizeHandler = require('./finalizeHandler');
const onChangeOrderHandler = require('./onChangeOrderHandler');
const orderOrFinalizeHandler = require('./orderOrFinalizeHandler');
const quantityHandler = require('./quantityHandler');

// utils
const onBundleSelected = require('../utils/onBundleSelected');
const onRemoveProductSelected = require('../utils/onRemoveProductSelected');
const onOrderOrFinaliseSelected = require('../utils/onOrderOrFinaliseSelected');
const onQuantitySelected = require('../utils/onQuantitySelected');

// mock handlers
jest.mock('./bundleInputsHandler');
jest.mock('./bundlesHandler');
jest.mock('./finalizeHandler');
jest.mock('./onChangeOrderHandler');
jest.mock('./orderOrFinalizeHandler');
jest.mock('./quantityHandler');

// mock utils 
jest.mock('../utils/onBundleSelected');
jest.mock('../utils/onRemoveProductSelected');
jest.mock('../utils/onOrderOrFinaliseSelected');
jest.mock('../utils/onQuantitySelected');



describe('register input handlers', () => {
    it('should register bundleInputs input handler', () => {
        const handlerMock = jest.fn();
        jest.spyOn(bundleInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en-bu');
        expect(addInputHandler).toHaveBeenCalledWith(bundleInputHandler.handlerName, handlerMock);
        expect(bundleInputHandler.getHandler).toHaveBeenCalledWith('en-bu', onBundleSelected);
    });
    it('should register bundles input handler', () => {
        const handlerMock = jest.fn();
        jest.spyOn(bundlesHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en-bu');
        expect(addInputHandler).toHaveBeenCalledWith(bundlesHandler.handlerName, handlerMock);
        expect(bundlesHandler.getHandler).toHaveBeenCalledWith('en-bu', onBundleSelected);
    });
    it('should register finalize input handler', () => {
        const handlerMock = jest.fn();
        jest.spyOn(finalizeHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en-bu');
        expect(addInputHandler).toHaveBeenCalledWith(finalizeHandler.handlerName, handlerMock);
        expect(finalizeHandler.getHandler).toHaveBeenCalledWith('en-bu');
    });
    it('should register on change order input handler', () => {
        const handlerMock = jest.fn();
        jest.spyOn(onChangeOrderHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en-bu');
        expect(addInputHandler).toHaveBeenCalledWith(onChangeOrderHandler.handlerName, handlerMock);
        expect(onChangeOrderHandler.getHandler).toHaveBeenCalledWith('en-bu', onRemoveProductSelected);
    });
    it('should register on order or finalize input handler', () => {
        const handlerMock = jest.fn();
        jest.spyOn(orderOrFinalizeHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en-bu');
        expect(addInputHandler).toHaveBeenCalledWith(orderOrFinalizeHandler.handlerName, handlerMock);
        expect(orderOrFinalizeHandler.getHandler).toHaveBeenCalledWith('en-bu', onOrderOrFinaliseSelected);
    });
    it('should register quantity input handler', () => {
        const handlerMock = jest.fn();
        jest.spyOn(quantityHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en-bu');
        expect(addInputHandler).toHaveBeenCalledWith(quantityHandler.handlerName, handlerMock);
        expect(quantityHandler.getHandler).toHaveBeenCalledWith('en-bu', onQuantitySelected);
    });

});
