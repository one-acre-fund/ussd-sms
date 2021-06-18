const onOrderOrFinaliseSelected = require('./onOrderOrFinaliseSelected');
const finalizeHandler = require('../inputHandlers/finalizeHandler');
const onKeepOrdering = require('./onKeepOrdering');
const splitMenu = require('../../../shared/splitLongMenu');
jest.mock('./onKeepOrdering');
jest.mock('../../../shared/splitLongMenu');
describe('on order or finalise selected', () => {
    beforeAll(() => {
        state.vars.bundles = JSON.stringify([{},{},{}, {}]);
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleName: 'Biolite',
                bundleInputs: [
                    {
                        price: 120,
                        quantity: 4,
                        unit: 'unit'   
                    }
                ]
            },
            {
                bundleName: 'Maize',
                bundleInputs: [
                    {
                        price: 60,
                        quantity: 320,
                        unit: 'kg'   
                    }
                ]
            }
        ]);
        state.vars.enrolling_client = JSON.stringify({FirstName: 'Jammie', LastName: 'Lanyster'});
    });
    it('should be call onKeepOrdering once user chooses 1', () => {
        onOrderOrFinaliseSelected('en_bu', '1');
        expect(onKeepOrdering).toHaveBeenCalledWith('en_bu');
    });

    it('should save the finalize screen as a state variable and prompt for finalize handler', () => {
        splitMenu.mockReturnValue({1: 'Jammie Lanyster ordered for \n' +
        'Biolite : 4 unit\n' +
        'Maize : 320 kg\n\n' +
        'Total Credit = 19680\n\n' +
        '1) Add another product\n' +
        '2) Change Order\n' +
        '3) Confirm'});
        onOrderOrFinaliseSelected('en_bu', '2');
        expect(sayText).toHaveBeenCalledWith('Jammie Lanyster ordered for \n' +
        'Biolite : 4 unit\n' +
        'Maize : 320 kg\n\n' +
        'Total Credit = 19680\n\n' +
        '1) Add another product\n' +
        '2) Change Order\n' +
        '3) Confirm');
        expect(promptDigits).toHaveBeenCalledWith(finalizeHandler.handlerName);
    });
});
