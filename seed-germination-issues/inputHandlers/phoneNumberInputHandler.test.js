const phoneNumberInputHandler = require('./phoneNumberInputHandler');

describe('phone number input handler', () => {
    beforeAll(() => {
        state.vars.chosen_duka = 'Kakamega';
        state.vars.lot_code = 'LOTCODE';
        state.vars.chosen_month = '11';
        state.vars.rsgi_seed_brand = 'Western Seed';
        state.vars.rsgi_seed_variety = 'Watermelon, 50g';
        state.vars.week_number = '1';
    });
    it('should reprompt for the phone number if the user submits an empty entry', () => {
        const handler = phoneNumberInputHandler.getHandler('en-ke');
        handler('');
        expect(sayText).toHaveBeenCalledWith('Please provide your phone number so we can follow up with you');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });

    it('should save all collected values into the data table', () => {
        const mockRow = {save: jest.fn()};
        const tableMock = {createRow: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(mockRow);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(tableMock);
        const handler = phoneNumberInputHandler.getHandler('en-ke');
        handler('075663820');
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('seed_germination_issues');
        expect(tableMock.createRow).toHaveBeenCalledWith({'vars': 
        {
            'duka': 'Kakamega',
            'lot_code': 'LOTCODE',
            'month': '11',
            'phone': '075663820',
            'seed_brand': 'Western Seed', 
            'seed_variety': 'Watermelon, 50g',
            'week': '1'}});
        expect(mockRow.save).toHaveBeenCalled();
    });
});