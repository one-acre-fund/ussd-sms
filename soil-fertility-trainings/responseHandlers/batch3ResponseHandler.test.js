const batch3ResponseHandler = require('./batch3ResponseHandler');
const batch4ResponseHandler = require('./batch4ResponseHandler');

describe('batch1 messages response handler', () => {
    it('should send all 10 batch 4 messages once the user responds to the batch 3 messages', () => {
        var lang = 'en-ke';
        var batch2Handler = batch3ResponseHandler.getHandler(lang);
        batch2Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'The best way to create organic matter is composting. Compost is a mixture of soil, leaves, stalks, other plant material and animal manure');
        expect(sendReply).toHaveBeenNthCalledWith(2, 'Compost mixture is full of great food for your plants that will enable you to have great harvests. Use as much compost as possible!');
        expect(sendReply).toHaveBeenNthCalledWith(3, 'To create compost piles you will need maize stalks, green materials like green leaves and grass, cow or chicken manure and urine and water.');
        expect(sendReply).toHaveBeenNthCalledWith(4, '1. Cut up maize stalks as much as possible.\n2. Use the chopped stalks to create the first layer of your row of compost (your waist height).');
        expect(sendReply).toHaveBeenNthCalledWith(5, '3. Add as much green plant material (fresh grass, green leaves, weeds, etc.) to the rows as possible. This speeds up decomposition.');
        expect(sendReply).toHaveBeenNthCalledWith(6, '4. Add as much cow or chicken manure and urine as possible to your rows of compost.');
        expect(sendReply).toHaveBeenNthCalledWith(7, '5. Finally, cover the pile with a thin layer (half a thumb length) of good soil to stop the rain from washing the compost away');
        expect(sendReply).toHaveBeenNthCalledWith(8, '6. Water until there is good moisture in the middle of the pile (it should always be moist but not wet).');
        expect(sendReply).toHaveBeenNthCalledWith(9, 'Turn your compost pile at least once a month. It is ready to use when it is dark brown, there is a smell of fresh soil and no green leaves.');
        expect(sendReply).toHaveBeenNthCalledWith(10, 'Once ready, you can mix your compost into the field at second ploughing. Always use both compost and fertiliser for the biggest harvest!!');
        expect(waitForResponse).toHaveBeenCalledWith(batch4ResponseHandler.handlerName);
    });
});
