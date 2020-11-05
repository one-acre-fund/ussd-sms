const lotCodeInputHandler = require('./lotCodeInputHandler');
const seedVarietyInputHandler = require('./seedVarietyInputHandler');

describe('seed variety input handler', () => {
    it('should reprompt for seed varirty if the input is invalid', () => {
        state.vars.varieties_option_values = JSON.stringify({1: 'option1', 2: 'option2'});
        state.vars.varieties_screens = JSON.stringify({1: 'screen1'});
        state.vars.current_varieties_screen = 1;
        const handler = seedVarietyInputHandler.getHandler('en-ke');
        handler('NA');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(seedVarietyInputHandler.handlerName);
    });

    it('should display the next screen if it is there', () => {
        state.vars.varieties_option_values = JSON.stringify({1: 'option1', 2: 'option2'});
        state.vars.varieties_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.current_varieties_screen = 1;
        const handler = seedVarietyInputHandler.getHandler('en-ke');
        handler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(promptDigits).toHaveBeenCalledWith(seedVarietyInputHandler.handlerName);
        expect(state.vars.current_varieties_screen).toEqual(2);
    });

    it('should prompt for lot number once the user chooses a seed variety', () => {
        state.vars.varieties_option_values = JSON.stringify({1: 'option1', 2: 'option2'});
        state.vars.varieties_screens = JSON.stringify({1: 'screen1'});
        state.vars.current_varieties_screen = 1;
        const handler = seedVarietyInputHandler.getHandler('en-ke');
        handler('2');
        expect(sayText).toHaveBeenCalledWith('Please enter the seed lot code on the seed packet you have purchased. ' +
         'This code is on the packet of the seed and is usually comprised of letters and numbers. Press 0 if you cannot find the code.');
        expect(promptDigits).toHaveBeenCalledWith(lotCodeInputHandler.handlerName);
        expect(state.vars.rsgi_seed_variety).toEqual('option2');
    });
});
