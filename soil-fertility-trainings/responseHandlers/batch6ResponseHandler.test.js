const batch6ResponseHandler = require('./batch6ResponseHandler');
const batch7ResponseHandler = require('./batch7ResponseHandler');

describe('batch 6 messages response handler', () => {
    it('should send all 4 batch 6 messages once the user responds to the batch 5 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch6Handler = batch6ResponseHandler.getHandler(lang);
        batch6Handler();
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': 
        [{'content': 'For healthier soil, manage soil acidity. Soil acidity is a condition that makes it difficult for plants to access the proper nutrients.',
            'priority': 2, 
            'to_number': '0780475911'}, 
        {'content': 'Soil acidity occurs when you have high rainfall, erosion and lack of crop rotation. It is worse when you do not have enough organic matter.',
            'priority': 2,
            'to_number': '0780475911'},
        {'content': 'Signs of high soil acidity include low yields and yellow plants in the farm even when you apply fertilizer. Also prone to pests and diseases.',
            'priority': 2,
            'to_number': '0780475911'}, 
        {'content': 'To correct soil acidity, Apply compost, Control erosion and Apply lime (soil improver). Talk to your FO to purchase lime for your farm!', 
            'priority': 2, 
            'to_number': '0780475911'}]});
        expect(waitForResponse).toHaveBeenCalledWith(batch7ResponseHandler.handlerName);
    });
});
