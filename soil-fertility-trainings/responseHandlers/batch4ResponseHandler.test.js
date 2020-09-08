const batch4ResponseHandler = require('./batch4ResponseHandler');
const batch5ResponseHandler = require('./batch5ResponseHandler');

describe('batch 4 messages response handler', () => {
    it('should send all 5 batch 5 messages once the user responds to the batch 4 messages', () => {
        var lang = 'en-ke';
        var batch4Handler = batch4ResponseHandler.getHandler(lang);
        batch4Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'You can also improve the quality of soil by planting legumes like beans, groundnuts, that put nutrients to your soil when they are growing.');
        expect(sendReply).toHaveBeenNthCalledWith(2, 'You can intercrop these crops with your maize in the long rains season, or practice crop rotation.');
        expect(sendReply).toHaveBeenNthCalledWith(3, 'To practice crop rotation, avoid planting the same crop on the same piece of land every year. Rotate legumes with cereals like maize.');
        expect(sendReply).toHaveBeenNthCalledWith(4, 'Other crops that significantly improve your soil quality include Grevillea Trees, Sweet Potatoes and Sunflowers.');
        expect(sendReply).toHaveBeenNthCalledWith(5, 'Why should we rotate our crops?\nA. To prevent pests and disease building up in our soil and have bigger harvests!\nB. To reduce soil health.');
        expect(waitForResponse).toHaveBeenCalledWith(batch5ResponseHandler.handlerName);
    });
});
