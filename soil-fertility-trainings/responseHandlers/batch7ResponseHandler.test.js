const batch7ResponseHandler = require('./batch7ResponseHandler');

describe('batch 7 messages response handler', () => {
    it('should send all 2 batch 7 messages once the user responds to the batch 6 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch7Handler = batch7ResponseHandler.getHandler(lang);
        batch7Handler();
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': [{'content': 'Protect your organic matter! Never burn anything or let animals eat too many plants on your land. Prevent erosion. Soil is gold!', 
            'priority': 2, 
            'to_number': '0780475911'},
        {'content': 'A very BIG KUDOS for compeleting the Soil Fertility Training. Choose at least 2 practices to protect your soil this season! Soil is gold!',
            'priority': 1, 
            'to_number': '0780475911'}]});
    });
});
