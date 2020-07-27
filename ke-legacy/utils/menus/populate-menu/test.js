var populateMenu = require('./populateMenu');
const { client } = require('../test-client-data');
var lang ='en';
global.project.vars = {
    end_find_oaf_contact: 'December 31, 2021',
    start_find_oaf_contact: 'December 31, 2019',
    end_training_non_client: 'December 31, 2021',
    start_training_non_client: 'December 31, 2019',
    end_prepayment_amount: 'December 31, 2021',
    start_prepayment_amount: 'December 31, 2019',
    end_tx_history: 'December 31, 2021',
    start_tx_history: 'December 31, 2019',
    end_make_payment_non_client: 'December 31, 2021',
    start_make_payment_non_client: 'December 31, 2019',
    end_locate_duka: 'December 31, 2021',
    start_locate_duka: 'December 31, 2019',
    end_make_payment: 'December 31, 2021',
    start_make_payment: 'December 31, 2019',
    end_check_balance: 'December 31, 2021',
    start_check_balance: 'December 31, 2019',
    end_training_client: 'December 31, 2021',
    start_training_client: 'December 31, 2019',
    end_FAW_order: 'December 31, 2021',
    start_FAW_order: 'December 31, 2019',
    end_solar: 'December 31, 2021',
    start_solar: 'December 31, 2019',
    end_insurance: 'December 31, 2021',
    start_insurance: 'December 31, 2019',
    end_contact_call_center: 'December 31, 2021',
    start_contact_call_center: 'December 31, 2019',
    end_locate_oaf_duka: 'December 31, 2021',
    start_locate_oaf_duka: 'December 31, 2019',
};
describe('ChickenServices', () => {
    beforeAll(() => {
        state.vars.client = JSON.stringify(client);
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
    beforeEach(()=>{
        jest.resetModules();
    });
    it('should be a function', () => {
        state.vars.client = JSON.stringify(client);
        expect(populateMenu).toBeInstanceOf(Function);
    });
    it('should only return the whole menu if the dates are satisfied',()=>{
        var populateMenu = require('./populateMenu');
        const menu = populateMenu(lang,140,false);
        console.log(menu);
        expect(typeof menu).toEqual('string');
        expect(menu).toMatch('1) Find my One Acre Fund contact\n2) Trainings\n3) Locate an OAF duka');

    });
    it('should not return an option that doesn\'t satisfy the date condition',()=>{
        global.project.vars.end_find_oaf_contact = 'December 31, 2019';
        global.project.vars.start_find_oaf_contact = 'December 31, 2018';
        var populateMenu = require('./populateMenu');
        const menu = populateMenu(lang,140,false);
        console.log(menu);
        expect(typeof menu).toEqual('string');
        expect(menu).toMatch('1) Trainings\n2) Locate an OAF duka');

    });
    it('should return an object of all the options if the character is greater than 140 satisfy the date condition',()=>{        
        state.vars.client = JSON.stringify(client);
        var populateMenu = require('./populateMenu');
        const menu = populateMenu(lang,140,true);
        console.log(menu);
        expect(typeof menu).toEqual('object');
        expect(JSON.stringify(menu)).toMatch("{\"0\":\"1) Make a payment\\n2) Check balance\\n3) training\\n4) View transaction history\\n5) FAW Pesticide Order\\n6) Solar\\n7) Insurance\\n77)Next page\",\"1\":\"44)Previous page\\n8)Contact Call center\\n9) Locate an OAF duka\\n\"}");

    });
    it('should return an object of only options that satisfy the date condition if the character is greater than 140',()=>{        
        var populateMenu = require('./populateMenu');
        const menu = populateMenu(lang,140,true);
        console.log(menu);
        expect(typeof menu).toEqual('object');
        expect(JSON.stringify(menu)).toMatch("{\"0\":\"1) Make a payment\\n2) Check balance\\n3) training\\n4) View transaction history\\n5) FAW Pesticide Order\\n6) Solar\\n7) Insurance\\n77)Next page\",\"1\":\"44)Previous page\\n8)Contact Call center\\n9) Locate an OAF duka\\n\"}");

    });

});