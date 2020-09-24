var districtResponseHandler = require('./responseHandlers/districtResponseHandler');

describe.each(['en-ke', 'sw'])('Maize recommendation using (%s)', (lang) => {

    beforeAll(() => {
        global.contact = {vars: {lang}};
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should send the welcome message and prompt for a district', () => {
        project.vars.dev_maize_recommendation_table = 'maize_recommendation_table';
        contact.phone_number = '0555345';
        var result = require('./maizeRecommendation')();
        var messages = [{
            'en-ke': 'Welcome to the OAF maize seed recommendation. Answer the questions to know the best maize variety for your farm.',
            'sw': 'Karibu kwenye mashauri na mapendekezo ya mahindi kutoka OAF. Jibu maswali ili ujue aina bora ya mahindi itakayofaa shamba lako.'
        }, {
            'en-ke': 'What is your district?',
            'sw': 'One Acre Fund District yako inaitwaje?'
        }];

        expect(project.sendMulti).toHaveBeenCalledWith({
            'message_type': 'text', 'messages': 
                [
                    {
                        'content': messages[0][lang],
                        'to_number': '0555345'
                    },
                    {
                        'content': messages[1][lang],
                        'to_number': '0555345'
                    }
                ]
        });
        expect(result).toEqual({'maize_recommendation_table': 'maize_recommendation_table', lang});
        expect(waitForResponse).toHaveBeenCalledWith(districtResponseHandler.handlerName);
    });
});

describe('checking for environment variables', () => {
    beforeAll(() => {
        global.contact = {vars: {lang: 'en-ke'}};
        service.vars = {};
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should use a production environment once the service is live', () => {
        service.active = true;
        project.vars.prod_maize_recommendation_table = 'production maize_recommendation_table';
        contact.phone_number = '0555345';
        var result = require('./maizeRecommendation')();
        expect(result.maize_recommendation_table).toEqual('production maize_recommendation_table');
    });

    it('should use a development environment once the service is not live', () => {
        service.active = false;
        project.vars.dev_maize_recommendation_table = 'develoment maize_recommendation_table';
        contact.phone_number = '0555345';
        var result = require('./maizeRecommendation')();
        expect(result.maize_recommendation_table).toEqual('develoment maize_recommendation_table');
    });
});