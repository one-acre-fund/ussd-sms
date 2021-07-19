const dukaInputHandler = require('./dukaInputHandler');
const monthInputHandler = require('./monthInputHandler');

describe('Duka input handler', () => {
    it('should reprompt for duka if the input is invalid', () => {
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('34534');
        expect(sayText).toHaveBeenCalledWith('In which Duka did you purchase the seed?');
        expect(promptDigits).toHaveBeenCalledWith(dukaInputHandler.handlerName);
    });

    it('should prompt user for a month once they enter a valid duka option', () => {
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('Kakamega');
        expect(sayText).toHaveBeenCalledWith('In which month did you purchase the seeds? Select month\n' +
        '1) January\n' +
        '2) February\n' +
        '3) March\n' +
        '4) April\n' +
        '5) May\n' +
        '6) June\n' +
        '7) July\n' +
        '8) August\n' +
        '77) Next');
        expect(promptDigits).toHaveBeenCalledWith(monthInputHandler.handlerName);
    });

    
    it('should save the necessary state variables once users enter a valid duka option', () => {
        const handler = dukaInputHandler.getHandler('en-ke');
        handler('kakamega');
        expect(state.vars.chosen_duka).toEqual('kakamega');
        expect(state.vars.months).toEqual('{"1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",' + 
        '"7":"7","8":"8","9":"9","10":"10","11":"11","12":"12"}');
        expect(state.vars.months_screens).toEqual('{"1":"In which month did you purchase the seeds? Select month' +
        '\\n1) January\\n2) February\\n3) March\\n4) April\\n5) May\\n6) June\\n7) July\\n8) August\\n77) Next","2":"9) September\\n10) October\\n11) November\\n12) December\\n"}');
        expect(state.vars.current_months_menu).toEqual(1);
    });
});