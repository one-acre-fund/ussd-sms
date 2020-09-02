var cropsInputHandler = require('./cropsInputHandler');
var varietiesHandler = require('./varietiesInputHandler');
var kgsHandler = require('./kgsInputHandler');

describe('Crops input handler', () => {
    const mockCursor = { next: jest.fn(), hasNext: jest.fn()};
    mockCursor.hasNext.mockReturnValueOnce(true);
    var mockRow = {vars: {variety: 'Singapusa', price_per_kg: 280}};
    const mockTable = { queryRows: jest.fn() };
    mockTable.queryRows.mockReturnValue(mockCursor);
    mockCursor.next.mockReturnValueOnce(mockRow);
    jest.spyOn(project, 'initDataTableById').mockReturnValue(mockTable);

    beforeAll(() => {
        global.state = { vars: {lang: 'en-mw'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should reprompt the user for a crop if their input doesn\'t match any crop', () => {
        state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
        cropsInputHandler.Handler('000');
        expect(sayText).toHaveBeenCalledWith('invalid input try again\nCrops\n' + 
        '1) Groundnuts\n' +
        '2) Rice\n' +
        '3) Pigeon peas\n');
        expect(promptDigits).toHaveBeenCalledWith(cropsInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
    it('should prompt for varieties when the user chooses a crop with more than one varieties', () => {
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: {variety: 'Tambala', price_per_kg: 250}};
        mockCursor.next.mockReturnValueOnce(mockRow);

        state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
        cropsInputHandler.Handler('2'); 
        expect(state.vars.selected_crop).toBe('Rice');
        expect(sayText).toHaveBeenCalledWith('Rice Varieties\n' + 
        '1) Singapusa\n' + 
        '2) Tambala\n');
        expect(state.vars.varieties).toBe('{"1":{"variety":"Singapusa","price":280},"2":{"variety":"Tambala","price":250}}');
        expect(promptDigits).toHaveBeenCalledWith(varietiesHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });

    it('should prompt user for Kgs to be sold once they select a crop other than rice', () => {
        state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
        cropsInputHandler.Handler('1'); 
        expect(state.vars.selected_crop).toBe('Groundnuts');
        expect(sayText).toHaveBeenCalledWith('Please enter the KGs that the client is selling, rounded to the closest number of KGs, as written on the contract');
        expect(promptDigits).toHaveBeenCalledWith(kgsHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
});
