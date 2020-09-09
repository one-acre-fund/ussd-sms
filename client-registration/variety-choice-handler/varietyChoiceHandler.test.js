var {handlerName,getHandler} = require('./varietyChoiceHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');

httpClient.request.mockReturnValue({status: 200});
describe('order confirmation handler test', ()=>{

    var varietyChoiceHandler;
    var onVarietyChosen;
    var bundleArray = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    var inputMenu = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    beforeAll(()=>{
        onVarietyChosen = jest.fn();
        varietyChoiceHandler = getHandler(onVarietyChosen);
        state.vars.allVarieties = JSON.stringify(bundleArray);
    });

    it('should call ELK',()=>{
        varietyChoiceHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call on variety choice handler function if the input from the user correspond to a valid bundle',()=>{
        state.vars.multiple_input_menus = false;
        varietyChoiceHandler(1);
        expect(onVarietyChosen).toHaveBeenCalledWith(bundleArray[0]);
    });
    it('should not call on variety choice handler function if the input from the user does  not correspond to a valid bundle',()=>{
        state.vars.multiple_input_menus = false;
        varietyChoiceHandler(3);
        expect(onVarietyChosen).not.toHaveBeenCalled();
    });
    it('should display the previous menu page if the input is 44 and the previous menu exists',()=>{
        state.vars.multiple_input_menus = true;
        state.vars.input_menu_loc = 1;
        state.vars.input_menu = JSON.stringify(inputMenu);
        varietyChoiceHandler(44);
        expect(sayText).toHaveBeenCalledWith(inputMenu[0]);
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should display the next menu page if the input is 77 and the next menu exists',()=>{
        state.vars.multiple_input_menus = true;
        state.vars.input_menu_loc = 0;
        state.vars.input_menu_length = 3;
        state.vars.input_menu = JSON.stringify(inputMenu);
        varietyChoiceHandler(77);
        expect(sayText).toHaveBeenCalledWith(inputMenu[1]);
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });


});