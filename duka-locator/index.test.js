const dukaLocator = require('./index');
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('../notifications/elk-notification/elkNotification');
describe('Duka locator', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should register input handlers', () => {
        dukaLocator.registerDukaLocatorHandlers({lang: 'en'});
        var regionHandlers = require('./inputHandlers/regionHandler');
        var countyHandler = require('./inputHandlers/countyHandler');
        var dukaHandler = require('./inputHandlers/dukaHandler');
        var contactDukaHandlerAgent = require('./inputHandlers/contactDukaAgentHandler');
        expect(addInputHandler).toHaveBeenCalledTimes(4);
        expect(addInputHandler).toHaveBeenCalledWith('select_oaf_duka_region', regionHandlers);
        expect(addInputHandler).toHaveBeenCalledWith('select_oaf_duka_county', countyHandler);
        expect(addInputHandler).toHaveBeenCalledWith('select_oaf_duka', dukaHandler);
        expect(addInputHandler).toHaveBeenCalledWith('reach_out_to_agent', contactDukaHandlerAgent);
    });

    it('should start the duka locator', () => {
        var regionsMock = [{vars: {region_id: 1, region_name: 'west region'}}, {vars: {region_id: 2, region_name: 'city valley'}}];
        var current = -1;
        var dukaRegionsTableMock = {
            num_rows: 2,
            queryRows: () => ({
                next: () => {
                    current= current + 1;
                    return regionsMock[current];
                },
                hasNext: () => current < regionsMock.length -1
            })
        };
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(dukaRegionsTableMock);
        dukaLocator.startDukaLocator({lang: 'en'});
        expect(sayText).toHaveBeenCalledWith('To find a One Acre Fund Duka near you, select region\n1) west region\n2) city valley\n3) My region is not listed\n');
        expect(promptDigits).toHaveBeenCalledWith('select_oaf_duka_region', {
            submitOnHash: false, maxDigits: 2, timeout: 5
        });
    });
    it('should call notifyELK',()=>{
        dukaLocator.startDukaLocator({lang: 'en'});
        expect(notifyELK).toHaveBeenCalled();
    });
});
