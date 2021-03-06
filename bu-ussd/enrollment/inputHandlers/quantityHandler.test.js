const quantityInputHandler = require('./quantityHandler');

describe('quantity input handler', () => {
    beforeAll(() => {
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleInputs: [
                    {
                        unit: 'kg',
                        max: '1000',
                        inputName: 'Pcli input'
                    }
                ]

            }
        ]);
    });

    it('should reprompt for empty input', () => {
        const onQuantitySelected = jest.fn();
        const handler = quantityInputHandler.getHandler('en_bu', onQuantitySelected);
        handler();
        expect(sayText).toHaveBeenCalledWith('Select Quantity: Pcli input /kg');
        expect(promptDigits).toHaveBeenCalledWith(quantityInputHandler.handlerName);
    });
    it('should reprompt for quantity if it is less than minimum', () => {
        const onQuantitySelected = jest.fn();
        const handler = quantityInputHandler.getHandler('en_bu', onQuantitySelected);
        handler('0');
        expect(sayText).toHaveBeenCalledWith('Select Quantity: Pcli input /kg');
        expect(promptDigits).toHaveBeenCalledWith(quantityInputHandler.handlerName);
    });
    it('should call onQuantitySelected if the input is valid', () => {
        const onQuantitySelected = jest.fn();
        const handler = quantityInputHandler.getHandler('en_bu', onQuantitySelected);
        handler('5');
        expect(onQuantitySelected).toHaveBeenCalledWith('en_bu', 5);
    });
    it('should call onQuantitySelected if the input is valid and the max allowed quantity is INFINITY', () => {
        const onQuantitySelected = jest.fn();
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleInputs: [
                    {
                        unit: 'unit',
                        max: 'INFINITY',
                        inputName: 'Biolite'
                    }
                ]

            }
        ]);
        const handler = quantityInputHandler.getHandler('en_bu', onQuantitySelected);
        handler('6');
        expect(onQuantitySelected).toHaveBeenCalledWith('en_bu', 6);
    });
    it('should reprompt for quantity if it is greater than minimum', () => {
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleInputs: [
                    {
                        unit: 'unit',
                        max: '1000',
                        inputName: 'Biolite'
                    }
                ]

            }
        ]);
        const onQuantitySelected = jest.fn();
        const handler = quantityInputHandler.getHandler('en_bu', onQuantitySelected);
        handler('10000');
        expect(sayText).toHaveBeenCalledWith('Select Quantity: Biolite /unit');
        expect(promptDigits).toHaveBeenCalledWith(quantityInputHandler.handlerName);
    });
});
