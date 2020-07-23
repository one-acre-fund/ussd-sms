var populateMenu = require('./populateMainMenu');
var mainMenu = require('./mainMenu');
const { client } = require('../test-client-data');
var lang ='en';
describe('ChickenServices', () => {
    beforeAll(() => {
        JSON.parse = jest.fn().mockImplementation(() => {
            return client ;
        });
        const mockCursor = { count: jest.fn(), 
        };
        
        const mockTable = { queryRows: jest.fn() };
        project.getOrCreateDataTable.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
        mockCursor.count.mockReturnValue(1);
    });
    it('should be a function', () => {
        state.vars.client = JSON.stringify(client);
        expect(populateMenu).toBeInstanceOf(Function);
    });
    // it('should log',()=>{
    //     state.vars.client = JSON.stringify(client);
    //     populateMenu(lang,140);
    //     expect(console.log).toHaveBeenCalled();

    // });

});