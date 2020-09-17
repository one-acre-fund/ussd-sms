const sectorInputHandler = require('./sectorInputHandler');

describe.each(['en', 'ki'])('Sectors input handler in (%s)', (lang) => {
    
    it('should reprompt the user for the sector once the input is not valid --' + lang, () => {
        const handler = sectorInputHandler.getHandler(lang, 'agrodealers_table');
        state.vars.sectors_list = JSON.stringify({'1': 'Sector1', '2': 'Sector2', '3': 'Sector3'});
        state.vars.sectors_screens = JSON.stringify({'1': 'screen 1', '2': 'screen 2'});
        state.vars.current_sectors_screen = 1;
        handler('00');
        expect(sayText).toHaveBeenCalledWith('screen 1');
    });

    it('should show the next screen once the user enters 77 --' + lang, () => {
        const handler = sectorInputHandler.getHandler(lang, 'agrodealers_table');
        state.vars.sectors_list = JSON.stringify({'1': 'Sector1', '2': 'Sector2', '3': 'Sector3'});
        state.vars.sectors_screens = JSON.stringify({'1': 'screen 1', '2': 'screen 2'});
        state.vars.current_sectors_screen = 1;
        handler(77);
        expect(sayText).toHaveBeenCalledWith('screen 2');
        expect(promptDigits).toHaveBeenCalledWith(sectorInputHandler.handlerName);
        expect(state.vars.current_sectors_screen).toEqual(2);
    });
    it('should  send the sms to the farmer and to the agro dealer once the user chooses an existing sector --' + lang, () => {
        const handler = sectorInputHandler.getHandler(lang, 'agrodealers_table');
        state.vars.sectors_list = JSON.stringify({'1': 'Sector1', '2': 'Sector2', '3': 'Sector3'});
        state.vars.sectors_screens = JSON.stringify({'1': 'screen 1', '2': 'screen 2'});
        contact.phone_number = '787664527';
        const aggroDealerRow = {vars: {
            agrodealer_name: 'Tyrion',
            cell: 'Kingslanding',
            credit_days_en: 'Monday, Wednesday',
            credit_days_ki: 'Kuwambere, Kuwagatatu',
            officer_phone: '788535221',
            officer_name: 'Jamie Lanyster'
        }};
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(() => true), next: jest.fn(() => aggroDealerRow)};
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        state.vars.current_sectors_screen = 1;
        handler(1);
        const smsToFarmer = {
            en: 'Tyrion is your nearest One Acre Fund Agrodealer partner shop. They are located in Kingslanding and offer credit and training on Monday, Wednesday. For more information you can contact your Shop Officer Jamie Lanyster on 788535221 or your Village Leader.',
            ki: 'Tyrion ni agrodealer ufite iduka rikorana . Aherereye mu Kingslanding atanga ideni n\'amahugurwa kuri iyi minsi y\'icyumweru Kuwambere, Kuwagatatu. Ku bindi bisobanura wahamagara Shop Officer Jamie Lanyster kuri 788535221 cyangwa umukuru w\'umudugudu wawe.'
        };
        const smsToOfficer = {
            en: 'There is a potential client with phonenumber 787664527. Please call them back to follow up. Thanks',
            ki: 'Hari  umuntu ushobora kuba umukiriya ufite numero ya telefoni 787664527. Umuhamagare umukurikirane. Urakoze.'
        };
        expect(project.sendMulti).toHaveBeenCalledWith({'message_type': 'text', 'messages': [{'content': smsToFarmer[lang], 'to_number': '788535221'}, {'content': smsToOfficer[lang], 'to_number': '787664527'}]});
        expect(sayText).toHaveBeenCalledWith(smsToFarmer[lang]);
    });

    it('should not send the sms if the agro dealer is not found in the look up table --' + lang, () => {
        const handler = sectorInputHandler.getHandler(lang, 'agrodealers_table');
        state.vars.sectors_list = JSON.stringify({'1': 'Sector1', '2': 'Sector2', '3': 'Sector3'});
        state.vars.sectors_screens = JSON.stringify({'1': 'screen 1', '2': 'screen 2'});
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(() => false), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        state.vars.current_sectors_screen = 1;
        handler(1);
        expect(project.sendMulti).not.toHaveBeenCalled();
        expect(sayText).not.toHaveBeenCalled();
    });
});
