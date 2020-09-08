const batch6ResponseHandler = require('./batch6ResponseHandler');
const batch7ResponseHandler = require('./batch7ResponseHandler');

describe('batch 6 messages response handler', () => {
    it('should send all 4 batch 6 messages once the user responds to the batch 5 messages', () => {
        var lang = 'en-ke';
        var batch6Handler = batch6ResponseHandler.getHandler(lang);
        batch6Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'For healthier soil, manage soil acidity. Soil acidity is a condition that makes it difficult for plants to access the proper nutrients.');
        expect(sendReply).toHaveBeenNthCalledWith(2, 'Soil acidity occurs when you have high rainfall, erosion and lack of crop rotation. It is worse when you do not have enough organic matter.');
        expect(sendReply).toHaveBeenNthCalledWith(3, 'Signs of high soil acidity include low yields and yellow plants in the farm even when you apply fertilizer. Also prone to pests and diseases.');
        expect(sendReply).toHaveBeenNthCalledWith(4, 'To correct soil acidity, Apply compost, Control erosion and Apply lime (soil improver). Talk to your FO to purchase lime for your farm!');
        expect(waitForResponse).toHaveBeenCalledWith(batch7ResponseHandler.handlerName);
    });
});
