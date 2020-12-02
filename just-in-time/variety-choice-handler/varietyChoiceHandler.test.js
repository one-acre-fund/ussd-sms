var {handlerName,getHandler} = require('./varietyChoiceHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
httpClient.request.mockReturnValue({status: 200});
describe('order confirmation handler test', ()=>{

    var varietyChoiceHandler;
    var onVarietyChosen;
    var bundleArray = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    var inputMenu = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockRow = {vars: {'bundleId': '-3009','bundleInputId': '-12109','bundle_name': 'Knapsack Sprayer','price': '2251','input_name': 'Knapsack Sprayer'}};
    const secondRow = {vars:{'bundleId': '-2960','bundleInputId': '-11920','bundle_name': 'Red Onion','price': '180','input_name': 'Red Creole'}};
    const availableVarietyRow = {vars: {'bundleId': '-3009','bundleInputId': '-12109','bundle_name': 'Knapsack Sprayer','price': '2251','input_name': 'Knapsack Sprayer','quantityavailable': 5, 'quantityordered': 3}};
    const unavailableVarietyRow = {vars:{'bundleId': '-2960','bundleInputId': '-11920','bundle_name': 'Red Onion','price': '180','input_name': 'Red Creole','quantityavailable': 5, 'quantityordered': 5}};
    beforeAll(()=>{
        onVarietyChosen = jest.fn();
        varietyChoiceHandler = getHandler(onVarietyChosen);
        state.vars.allVarieties = JSON.stringify(bundleArray);
        const mockTable = { queryRows: jest.fn()};
        mockTable.queryRows.mockReturnValue(mockCursor);
        project.initDataTableById.mockReturnValue(mockTable);
        state.vars.varietyBundleId = -3009;
    });

    it('should call ELK',()=>{
        varietyChoiceHandler();
        expect(notifyELK).toHaveBeenCalled;
    });
    it('should call on variety choice handler function if the input from the user correspond to a valid bundle',()=>{
        state.vars.multiple_input_menus = false;
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(availableVarietyRow);
        varietyChoiceHandler(1);
        expect(onVarietyChosen).toHaveBeenCalledWith(bundleArray[0]);
    });
    it('should not call on variety choice handler function if there is no available variety',()=>{
        state.vars.multiple_input_menus = false;
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(false);
        mockCursor.next.mockReturnValueOnce(mockRow);
        varietyChoiceHandler(1);
        expect(onVarietyChosen).not.toHaveBeenCalled();
    });
    it('should call the corresponding available variety choice handler function if there is no both available and unavailable varieties',()=>{
        state.vars.multiple_input_menus = false;
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(secondRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(availableVarietyRow).mockReturnValueOnce(unavailableVarietyRow);
        varietyChoiceHandler(1);
        expect(onVarietyChosen).toHaveBeenCalledWith(bundleArray[0]);
    });
    it('should call not call on variety choice handler function if the input from the user does not correspond to a valid bundle',()=>{
        state.vars.multiple_input_menus = false;
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow);
        varietyChoiceHandler(4);
        expect(onVarietyChosen).not.toHaveBeenCalled();
    });
    it('should call not call on variety choice handler function if the bundle Id does not correspond to any bundle input',()=>{
        state.vars.varietyBundleId = -300;
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow);
        varietyChoiceHandler(1);
        expect(onVarietyChosen).not.toHaveBeenCalled();
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