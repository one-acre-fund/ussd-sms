const seedBrandInputHandler = require('./seedBrandInputHandler');
const customSeedBrandInputHandler  = require('./customSeedBrandInputHandler');
const seedVarietyInputHandle = require('./seedVarietyInputHandler');

describe('seed brand input handler using', () => {
    afterEach(() => {
        state.vars = {};
    });

    it('should handle the invalid options', () => {
        state.vars.seeds_screens = JSON.stringify({1: 'Title\n1) option1'});
        state.vars.seeds_option_values = JSON.stringify({1: 'option1'});
        state.vars.current_seeds_screen = 1;
        const handler = seedBrandInputHandler.getHandler('en-ke');
        handler('100');
        expect(sayText).toHaveBeenCalledWith('Title\n1) option1');
        expect(promptDigits).toHaveBeenCalledWith(seedBrandInputHandler.handlerName);
    });

    it('should show the next screen if user enters 99 and it is available', () => {
        state.vars.seeds_screens = JSON.stringify({1: 'Title\n1) option1\n99) Next', 2: '2) option2'});
        state.vars.seeds_option_values = JSON.stringify({1: 'option1', 2: 'option2'});
        state.vars.current_seeds_screen = 1;
        const handler = seedBrandInputHandler.getHandler('en-ke');
        handler('99');
        expect(sayText).toHaveBeenCalledWith('2) option2');
        expect(promptDigits).toHaveBeenCalledWith(seedBrandInputHandler.handlerName);
    });

    it('should ask the user to enter the seed brand once they select other', () => {
        state.vars.seeds_screens = JSON.stringify({1: 'Title\n1) option1\n99) Next', 2: '2) option2\n3) Other'});
        state.vars.seeds_option_values = JSON.stringify({1: 'option1', 2: 'option2', 3: 'Other'});
        state.vars.current_seeds_screen = 1;
        const handler = seedBrandInputHandler.getHandler('en-ke');
        handler('3');
        expect(sayText).toHaveBeenCalledWith('Please write the name of the seed brand you purchased in the Duka.');
        expect(promptDigits).toHaveBeenCalledWith(customSeedBrandInputHandler.handlerName);
    });

    it('should ask the user to enter the seed brand once they select other', () => {
        state.vars.seeds_screens = JSON.stringify({1: 'Title\n1) option1\n99) Next', 2: '2) option2\n3) Other'});
        state.vars.seeds_option_values = JSON.stringify({1: 'option1', 2: 'option2', 3: 'Other'});
        state.vars.current_seeds_screen = 1;

        var cursor = {hasNext: jest.fn(), next: jest.fn()};

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_variety: 'Monsanto'}});
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_variety: 'Bubayi'}});
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_variety: 'Kenya Seed'}});
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        const handler = seedBrandInputHandler.getHandler('en-ke');
        handler('2');
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'seed_name': 'option2'}});
        expect(sayText).toHaveBeenCalledWith('Which seed variety did you purchase? Please select number\n' +
        '1) Monsanto\n' +
        '2) Bubayi\n' +
        '3) Kenya Seed\n');
        expect(promptDigits).toHaveBeenCalledWith(seedVarietyInputHandle.handlerName);
        expect(state.vars.rsgi_seed_brand).toEqual('option2');
    });
});