const countyHandler = require('./countyHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
jest.mock('../../notifications/elk-notification/elkNotification');
describe('County handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should handle the county selected', () => {
        var countiesMock = [{vars: {countie_id: 1, duka_id: 2, duka_name: 'Duka salio'}}];
        state.vars.labeled_counties = JSON.stringify({'2': 1});
        var current = -1;
        var dukaCountiesTableMock = {
            num_rows: 1,
            queryRows: () => ({
                next: () => {
                    current= current + 1;
                    return countiesMock[current];
                },
                hasNext: () => current < countiesMock.length -1
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukaCountiesTableMock);
        countyHandler('2');
        expect(sayText).toHaveBeenCalledWith('Please select your duka\n1) Duka salio\n');
        expect(promptDigits).toHaveBeenCalledWith('select_oaf_duka', {
            submitOnHash: false, maxDigits: 2, timeout: 5
        });
    });

    it('should handle the invalid choice', () => {
        state.vars.labeled_counties = JSON.stringify({'2': 1});
        state.vars.filtered_counties = JSON.stringify(['ingati, ayoba, sasamu']);
        var dukaCountiesTableMock = {
            num_rows: 1,
            queryRows: () => ({
                hasNext: () => false
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukaCountiesTableMock);
        countyHandler('3');
        expect(sayText).toHaveBeenCalledWith('Sorry, OAF currently has OAF Dukas in the following locations\ningati, ayoba, sasamu');
        expect(stopRules).toHaveBeenCalledWith();
    });
    it('should call ELK',()=>{
        countyHandler('3');
        expect(notifyELK).toHaveBeenCalled();
    });
});
