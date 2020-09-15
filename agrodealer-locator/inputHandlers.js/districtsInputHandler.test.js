const districtsInputHandler = require('./districtInputHandler');
const sectorsInputHandler = require('./sectorInputHandler');

describe.each(['en', 'ki'])('Districts input handler in (%s)', (lang) => {
    beforeEach(() => {
        jest.resetModules();
    });
    
    it('should display the districts menu and reprompt the user for the district if the input is invalid --' + lang, () => {
        const displayDistricts = jest.fn();
        const getSectors = jest.fn();
        const agrodealers_address_table = 'agrodealers_address_table';
        const handler = districtsInputHandler.getHandler(lang, displayDistricts, getSectors, agrodealers_address_table);
        handler(99);
        expect(displayDistricts).toHaveBeenCalled();
        expect(promptDigits).toHaveBeenCalledWith(districtsInputHandler.handlerName);
    });

    it('should tell the user if their district is not supported --' + lang, () => {
        const noDistrictMessage = {'en': 'We do not currently have an agrodealer partner shop located in your District',
            'ki': ''};
        const displayDistricts = jest.fn();
        const getSectors = jest.fn();
        const agrodealers_address_table = 'agrodealers_address_table';
        const handler = districtsInputHandler.getHandler(lang, displayDistricts, getSectors, agrodealers_address_table);
        handler(5);
        expect(sayText).toHaveBeenCalledWith(noDistrictMessage[lang]);
        expect(stopRules).toHaveBeenCalled();
    });

    it('should call display the sectors function and prompt the user for the sectors --' + lang, () => {
        const displayDistricts = jest.fn();
        const getSectors = jest.fn(() => ({screens: {1: '1) Sector1\n2) Sector2', 2: '2) Screen3\n3) Screen4'}, list: {
            '1': 'Sector1',
            '2': 'Sector2',
            '3': 'Sector3',
            '4': 'Sector4',
        }}));
        const agrodealers_address_table = 'agrodealers_address_table';
        const handler = districtsInputHandler.getHandler(lang, displayDistricts, getSectors, agrodealers_address_table);
        handler(1);
        expect(getSectors).toHaveBeenCalledWith('Gakenke', 'agrodealers_address_table', lang);
        expect(sayText).toHaveBeenCalledWith('1) Sector1\n2) Sector2');
        expect(promptDigits).toHaveBeenCalledWith(sectorsInputHandler.handlerName);
        expect(state.vars.sectors_list).toEqual('{"1":"Sector1","2":"Sector2","3":"Sector3","4":"Sector4"}');
        expect(state.vars.current_sectors_screen).toEqual(1);
        expect(state.vars.sectors_screens).toEqual('{"1":"1) Sector1\\n2) Sector2","2":"2) Screen3\\n3) Screen4"}');
        expect(state.vars.selected_district).toEqual('Gakenke');
    });
});