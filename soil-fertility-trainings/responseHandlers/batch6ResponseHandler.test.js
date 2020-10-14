const batch6ResponseHandler = require('./batch6ResponseHandler');
const batch7ResponseHandler = require('./batch7ResponseHandler');

describe('batch 6 messages response handler', () => {
    it('should send all 4 batch 6 messages once the user responds to the batch 5 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch6Handler = batch6ResponseHandler.getHandler(lang);
        batch6Handler();

        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'For healthier soil, manage soil acidity. Soil acidity is a condition that makes it difficult for plants to access the proper nutrients.',
                'to_number': '0780475911',
                'start_time_offset': 0,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Soil acidity occurs when you have high rainfall, erosion and lack of crop rotation. It is worse when you do not have enough organic matter.',
                'to_number': '0780475911',
                'start_time_offset': 15,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Signs of high soil acidity include low yields and yellow plants in the farm even when you apply fertilizer. Also prone to pests and diseases.',
                'to_number': '0780475911',
                'start_time_offset': 30,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'To correct soil acidity, Apply compost, Control erosion and Apply lime (soil improver). Talk to your FO to purchase lime for your farm!',
                'to_number': '0780475911',
                'start_time_offset': 45,});
        expect(waitForResponse).toHaveBeenCalledWith(batch7ResponseHandler.handlerName);
    });
});
