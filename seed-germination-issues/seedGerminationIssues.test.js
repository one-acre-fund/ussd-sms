const seedGerminationIssues = require('./seedGerminationIssues');
var seedBrandInputHandler = require('./inputHandlers/seedBrandInputHandler');

describe('seed germination issues', () => {
    it('should start the seed germination issues', () => {
        var cursor = {hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_name: 'Bubayi'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_name: 'Kenya Seed'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_name: 'Monsanto'}});
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        seedGerminationIssues.start('en-ke');
        expect(sayText).toHaveBeenCalledWith('Which seed brand did you purchase? Please select number\n' + 
        '1) Bubayi\n' + 
        '2) Kenya Seed\n' +
        '3) Monsanto\n' +
        '4) Other\n');
        expect(promptDigits).toHaveBeenCalledWith(seedBrandInputHandler.handlerName);
    });

    it('should set the necessary state variables', () => {
        var cursor = {hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_name: 'Bubayi'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_name: 'Kenya Seed'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {seed_name: 'Monsanto'}});
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        seedGerminationIssues.start('en-ke');
        expect(state.vars.current_seeds_screen).toEqual(1);
        expect(state.vars.seeds_screens).toEqual('{"1":"1) Bubayi\\n2) Kenya Seed\\n3) Monsanto\\n4) Other\\n"}');
        expect(state.vars.seeds_option_values).toEqual('{"1":"Bubayi","2":"Kenya Seed","3":"Monsanto","4":"Other"}');
    });

    it('should export the option for Other seed brand', () => {
        expect(seedGerminationIssues.otherOption).toEqual({'en-ke': 'Other', 'sw': 'Nyingine'});
    });
});