var seasonResponseHandler = require('./seasonHandler');

describe('Season response handler', () => {

    beforeAll(() => {
        contact.phone_number = '0555345';
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should ask the user to try again once the choosen option is not valid', () => {
        var lang = 'en-ke';
        global.content = 'kk';
        state.vars.district = 'district1';
        state.vars.bags_message = 'Did you plant maize right after the rains started last year?\n' + 
        'A. Yes\n' +
        'B. No';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => false), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        var recommendation_table = 'dev_recommendation_table';
        var seasonHandler = seasonResponseHandler.getHandler(lang, recommendation_table);
        seasonHandler();
        expect(sendReply).toHaveBeenCalledWith('Did you plant maize right after the rains started last year?\n' + 
        'A. Yes\n' +
        'B. No');
        expect(waitForResponse).toHaveBeenLastCalledWith(seasonResponseHandler.handlerName);
    });

    it('should ask the user to try again once the choosen option is empty', () => {
        var lang = 'en-ke';
        global.content = undefined;
        state.vars.district = 'district1';
        state.vars.bags_message = 'Did you plant maize right after the rains started last year?\n' + 
        'A. Yes\n' +
        'B. No';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => false), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        var recommendation_table = 'dev_recommendation_table';
        var seasonHandler = seasonResponseHandler.getHandler(lang, recommendation_table);
        seasonHandler();
        expect(sendReply).toHaveBeenCalledWith('Did you plant maize right after the rains started last year?\n' + 
        'A. Yes\n' +
        'B. No');
        expect(waitForResponse).toHaveBeenLastCalledWith(seasonResponseHandler.handlerName);
    });

    it('should send a medium productivity when the user selects A and the last choice was B', () => {
        var lang = 'en-ke';
        global.content = 'a ';
        state.vars.district = 'district1';
        state.vars.bags = 'B';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => true), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        jest.spyOn(row, 'next').mockReturnValueOnce({vars: {
            medium_productivity: 'medium productivity',
            low_productivity: 'low productivity',
            high_productivity: 'high productivity' 
        }});
        var recommendation_table = 'dev_recommendation_table';
        var seasonHandler = seasonResponseHandler.getHandler(lang, recommendation_table);
        seasonHandler();
        expect(project.getOrCreateDataTable).toHaveBeenLastCalledWith(recommendation_table);
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'district': 'district1'}});
        expect(sendReply).toHaveBeenCalledWith('OAF experts recommend: medium productivity');
    });

    it('should send a high productivity when the user selects A and the last choice was C', () => {
        var lang = 'en-ke';
        global.content = ' a';
        state.vars.district = 'district1';
        state.vars.bags = 'C';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => true), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        jest.spyOn(row, 'next').mockReturnValueOnce({vars: {
            medium_productivity: 'medium productivity',
            low_productivity: 'low productivity',
            high_productivity: 'high productivity' 
        }});
        var recommendation_table = 'dev_recommendation_table';
        var seasonHandler = seasonResponseHandler.getHandler(lang, recommendation_table);
        seasonHandler();
        expect(project.getOrCreateDataTable).toHaveBeenLastCalledWith(recommendation_table);
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'district': 'district1'}});
        expect(sendReply).toHaveBeenCalledWith('OAF experts recommend: high productivity');
    });

    it('should send a low productivity when the user selects B and the last choice was B', () => {
        var lang = 'en-ke';
        global.content = ' b';
        state.vars.district = 'district1';
        state.vars.bags = 'B';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => true), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        jest.spyOn(row, 'next').mockReturnValueOnce({vars: {
            medium_productivity: 'medium productivity',
            low_productivity: 'low productivity',
            high_productivity: 'high productivity' 
        }});
        var recommendation_table = 'dev_recommendation_table';
        var seasonHandler = seasonResponseHandler.getHandler(lang, recommendation_table);
        seasonHandler();
        expect(project.getOrCreateDataTable).toHaveBeenLastCalledWith(recommendation_table);
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'district': 'district1'}});
        expect(sendReply).toHaveBeenCalledWith('OAF experts recommend: low productivity');
    });

    it('should send a medium productivity when the user selects B and the last choice was C', () => {
        var lang = 'en-ke';
        global.content = ' B';
        state.vars.district = 'district1';
        state.vars.bags = 'C';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => true), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        jest.spyOn(row, 'next').mockReturnValueOnce({vars: {
            medium_productivity: 'medium productivity',
            low_productivity: 'low productivity',
            high_productivity: 'high productivity' 
        }});
        var recommendation_table = 'dev_recommendation_table';
        var seasonHandler = seasonResponseHandler.getHandler(lang, recommendation_table);
        seasonHandler();
        expect(project.getOrCreateDataTable).toHaveBeenLastCalledWith(recommendation_table);
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'district': 'district1'}});
        expect(sendReply).toHaveBeenCalledWith('OAF experts recommend: medium productivity');
    });
});