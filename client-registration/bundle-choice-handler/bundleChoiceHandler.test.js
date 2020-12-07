var {handlerName,getHandler} = require('./bundleChoiceHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var {client}  = require('../../client-enrollment/test-client-data');
jest.mock('../../notifications/elk-notification/elkNotification');
httpClient.request.mockReturnValue({status: 200});
describe('order confirmation handler test', ()=>{

    var bundleChoiceHandler, displayBundles;
    var onBundleSelected;
    var bundleArray = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer','quantity': 9},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    var inputMenu = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    beforeAll(()=>{
        onBundleSelected = jest.fn();
        displayBundles = jest.fn();
        bundleChoiceHandler = getHandler(onBundleSelected,displayBundles);
        state.vars.bundles = JSON.stringify(bundleArray);
        state.vars.newClient = JSON.stringify(client);
    });

    it('should call ELK',()=>{
        bundleChoiceHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call on bundle selected function if the input from the user correspond to a valid bundle input choice',()=>{
        state.vars.multiple_input_menus = false;
        bundleChoiceHandler(1);
        expect(onBundleSelected).toHaveBeenCalledWith(bundleArray[0].bundleId);
    });
    it('should set  on state.vars.chosenMaizeBundle bundle if the quantity is defined ',()=>{
        state.vars.multiple_input_menus = false;
        bundleArray[0].quantity = 9;
        bundleChoiceHandler(1);
        expect(state.vars.chosenMaizeBundle).toEqual(JSON.stringify(bundleArray[0]));
    });
    it('should not call on bundle selected function function if the input from the user does  not correspond to a valid bundle',()=>{
        state.vars.multiple_input_menus = false;
        bundleChoiceHandler(3);
        expect(onBundleSelected).not.toHaveBeenCalled();
    });
    it('should display the previous menu page if the input is 44 and the previous menu exists',()=>{
        state.vars.multiple_input_menus = true;
        state.vars.input_menu_loc = 1;
        state.vars.input_menu = JSON.stringify(inputMenu);
        bundleChoiceHandler(44);
        expect(sayText).toHaveBeenCalledWith(inputMenu[0]);
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should display the next menu page if the input is 77 and the next menu exists',()=>{
        state.vars.multiple_input_menus = true;
        state.vars.input_menu_loc = 0;
        state.vars.input_menu_length = 3;
        state.vars.input_menu = JSON.stringify(inputMenu);
        bundleChoiceHandler(77);
        expect(sayText).toHaveBeenCalledWith(inputMenu[1]);
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });


});