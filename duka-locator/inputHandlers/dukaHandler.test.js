const dukaHandler = require('./dukaHandler');

describe('Duka locator', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should handle the duka selected', () => {
        var countiesMock = [{vars: {duka_id: 2, duka_name: 'Duka salio', en: 'duka address', sw: 'addresi ya duka'}}];
        state.vars.labeled_dukas = JSON.stringify({'1': 2});
        var current = -1;
        var dukasTableMock = {
            num_rows: 1,
            queryRows: () => ({
                next: () => {
                    current= current + 1;
                    return countiesMock[current];
                },
                hasNext: () => current < countiesMock.length -1
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukasTableMock);
        dukaHandler('1');
        expect(sayText).toHaveBeenCalledWith('duka address\n1) Reach out to a duka agent.\n2) Exit menu\n');
        expect(promptDigits).toHaveBeenCalledWith('reach_out_to_agent', {
            submitOnHash: false, maxDigits: 2, timeout: 5
        });
    });

    it('should handle the invalid input', () => {
        state.vars.labeled_dukas = JSON.stringify({'1': 2});
        state.vars.duka_current_menu = 'select duka menu';
        var dukasTableMock = {
            num_rows: 1,
            queryRows: () => ({
                hasNext: () => false
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukasTableMock);
        dukaHandler('1');
        expect(sayText).toHaveBeenCalledWith('Invalid input\nselect duka menu');
        expect(promptDigits).toHaveBeenCalledWith('select_oaf_duka', {
            submitOnHash: false, maxDigits: 2, timeout: 5
        });
    });


});
