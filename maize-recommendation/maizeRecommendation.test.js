var districtResponseHandler = require('./responseHandlers/districtResponseHandler');

describe('Maize recommendation', () => {

    beforeAll(() => {
        global.contact = {vars: {lang: 'en-ke'}};
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should send the welcome message and prompt for a district', () => {
        project.vars.dev_maize_recommendation_table = 'maize_recommendation_table';
        contact.phone_number = '0555345';
        var addResponseHandlers = require('./responseHandlers/addResponseHandlers');
        jest.mock('./responseHandlers/addResponseHandlers');
        require('./maizeRecommendation');
        global.main();
        expect(project.sendMulti).toHaveBeenCalledWith({
            'message_type': 'text', 'messages': 
                [
                    {
                        'content': 'Welcome to the OAF maize seed recommendation. Answer the questions to know the best maize variety for your farm.',
                        'to_number': '0555345'
                    },
                    {
                        'content': 'What is your district?',
                        'to_number': '0555345'
                    }
                ]
        });
        expect(waitForResponse).toHaveBeenCalledWith(districtResponseHandler.handlerName);
        expect(addResponseHandlers).toHaveBeenCalledWith('en-ke', 'maize_recommendation_table');
    });
});