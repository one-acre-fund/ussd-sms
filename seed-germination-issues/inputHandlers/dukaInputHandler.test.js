const dukaInputHandler = require('./dukaInputHandler');
const monthInputHandler = require('./monthInputHandler');

describe('Duka input handler', () => {
    it('should reprompt for duka if the input is invalid', () => {
        state.vars.duka_option_values = JSON.stringify({1: 'kak'});
        state.vars.duka_screens = JSON.stringify({1: 'screen1'});
        state.vars.current_dukas_menu = 1;
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('abcd');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(dukaInputHandler.handlerName);
    });

    it('should show the next screen when user enters 99', () => {
        state.vars.duka_option_values = JSON.stringify({1: 'kak'});
        state.vars.duka_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.current_dukas_menu = 1;
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('99');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(promptDigits).toHaveBeenCalledWith(dukaInputHandler.handlerName);
    });

    it('should prompt user for a month once they enter a valid duka option', () => {
        state.vars.duka_option_values = JSON.stringify({1: 'kak', 2: 'kap', 3: 'mal'});
        state.vars.duka_screens = JSON.stringify({1: 'screen1'});
        state.vars.current_dukas_menu = 1;
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('2');
        expect(sayText).toHaveBeenCalledWith('In which month did you plant? Select month\n' +
        '1) January\n' +
        '2) February\n' +
        '3) March\n' +
        '4) April\n' +
        '5) May\n' +
        '6) June\n' +
        '7) July\n' +
        '8) August\n' +
        '9) September\n' +
        '77) Next');
        expect(promptDigits).toHaveBeenCalledWith(monthInputHandler.handlerName);
    });

    
    it('should save the necessary state variables once users enter a valid duka option', () => {
        state.vars.duka_option_values = JSON.stringify({1: 'kak', 2: 'kap', 3: 'mal'});
        state.vars.duka_screens = JSON.stringify({1: 'screen1'});
        state.vars.current_dukas_menu = 1;
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('2');
        expect(state.vars.months).toEqual('{"1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",' + 
        '"7":"7","8":"8","9":"9","10":"10","11":"11","12":"12"}');
        expect(state.vars.months_screens).toEqual('{"1":"In which month did you plant? Select month\\n' + 
        '1) January\\n2) February\\n3) March\\n4) April\\n5) May\\n6) June\\n7) July\\n8) August\\n' + 
        '9) September\\n77) Next","2":"10) October\\n11) November\\n12) December\\n"}');
        expect(state.vars.current_months_menu).toEqual(1);
    });
});