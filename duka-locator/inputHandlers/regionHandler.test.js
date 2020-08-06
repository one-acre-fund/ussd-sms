const regionHandler = require('./regionHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
jest.mock('../../notifications/elk-notification/elkNotification');
describe('region Handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should handle the region selected', () => {
        var countiesMock = [{vars: {region_id: 1, countie_id: 2, countie_name: 'ingati'}}];
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
        regionHandler('1');
        expect(state.vars.filtered_counties).toEqual(JSON.stringify(['ingati']));
        expect(sayText).toHaveBeenCalledWith('Please select your county\n1) ingati\n\n');
        expect(promptDigits).toHaveBeenCalledWith('select_oaf_duka_county', {
            submitOnHash: false, maxDigits: 2, timeout: 5
        });
    });

    it('should handle the invalid option', () => {
        state.vars.not_listed_option = 3;
        state.vars.all_regions = JSON.stringify(['ingati', 'ibiza']);
        var dukaCountiesTableMock = {
            num_rows: 1,
            queryRows: () => ({
                hasNext: () => false
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukaCountiesTableMock);
        regionHandler('3');
        expect(sayText).toHaveBeenCalledWith('Sorry, OAF currently has OAF Dukas in the following locations\ningati, ibiza');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should handle the not listed choice', () => {
        var dukaCountiesTableMock = {
            num_rows: 1,
            queryRows: () => ({
                hasNext: () => false
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukaCountiesTableMock);
        regionHandler('2');
        expect(sayText).toHaveBeenCalledWith('Invalid input\nPlease select your county\n1) ingati\n\n');
        expect(promptDigits).toHaveBeenCalledWith('select_oaf_duka_region', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });
    it('should call notifyELK',()=>{
        regionHandler('2');
        expect(notifyELK).toHaveBeenCalled();
    });
});
