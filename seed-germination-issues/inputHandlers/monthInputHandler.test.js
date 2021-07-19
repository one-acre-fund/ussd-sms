const monthInputHandler = require('./monthInputHandler');
const dateInputHandler = require('./plantingDateInputHandler');

describe('month input handler', () => {
    it('should reprompt for the month once the user enters invalid option', () => {
        state.vars.months_screens = JSON.stringify({1: 'screen1'});
        state.vars.months = JSON.stringify({1: '1', 2: '2'});
        state.vars.current_months_menu = 1;
        const handler = monthInputHandler.getHandler('en-ke');
        handler('abcd');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(monthInputHandler.handlerName);
    });

    it('should show the next screen once the user enters 77', () => {
        state.vars.months_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.months = JSON.stringify({1: '1', 2: '2'});
        state.vars.current_months_menu = 1;
        const handler = monthInputHandler.getHandler('en-ke');
        handler('77');
        expect(state.vars.current_months_menu).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(promptDigits).toHaveBeenCalledWith(monthInputHandler.handlerName);
    });

    it('should prompt for a planting date once the user enters a valid month', () => {
        state.vars.months_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.months = JSON.stringify({1: '1', 2: '2'});
        state.vars.current_months_menu = 1;
        const handler = monthInputHandler.getHandler('en-ke');
        handler('1');
        expect(sayText).toHaveBeenCalledWith('When did you plant the seeds? Include date, Month and year. (dd/mm/yyyy)');
        expect(promptDigits).toHaveBeenCalledWith(dateInputHandler.handlerName);
        expect(state.vars.chosen_month).toEqual('1');
    });
});