const batch2ResponseHandler = require('./batch2ResponseHandler');
const batch3ResponseHandler = require('./batch3ResponseHandler');

describe('batch1 messages response handler', () => {
    it('should send all 5 batch 3 messages once the user responds to the batch 2 messages', () => {
        var lang = 'en-ke';
        var batch2Handler = batch2ResponseHandler.getHandler(lang);
        batch2Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'Soil organic matter is made of plant and animal material put back into the soil. Examples are animal waste, plant residues and compost.');
        expect(sendReply).toHaveBeenNthCalledWith(2, 'Organic matter contains many special nutrients and increases soil\'s ability to hold water like a sponge. It can also reduce soil acidity.');
        expect(sendReply).toHaveBeenNthCalledWith(3, 'Add organic matter back to the soil each year. This allows your soil to stay rich and healthy for next year\'s crop.');
        expect(sendReply).toHaveBeenNthCalledWith(4, 'Remember, unlike fertilizer, organic matter stays in the soil for many years - it is a long term improvement!');
        expect(sendReply).toHaveBeenNthCalledWith(5, 'There are many ways to improve your soil organic matter. We will learn about composting, crop rotation, planting legumes and using lime.');
        expect(waitForResponse).toHaveBeenCalledWith(batch3ResponseHandler.handlerName);
    });
});
