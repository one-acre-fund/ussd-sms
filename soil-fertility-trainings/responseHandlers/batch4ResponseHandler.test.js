const batch4ResponseHandler = require('./batch4ResponseHandler');
const batch5ResponseHandler = require('./batch5ResponseHandler');

describe('batch 4 messages response handler', () => {
    it('should send all 5 batch 5 messages once the user responds to the batch 4 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch4Handler = batch4ResponseHandler.getHandler(lang);
        batch4Handler();
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': 
        [{'content': 'You can also improve the quality of soil by planting legumes like beans, groundnuts, that put nutrients to your soil when they are growing.',
            'priority': 2, 
            'to_number': '0780475911'},
        {'content': 'You can intercrop these crops with your maize in the long rains season, or practice crop rotation.', 
            'priority': 2, 
            'to_number': '0780475911'},
        {'content': 'To practice crop rotation, avoid planting the same crop on the same piece of land every year. Rotate legumes with cereals like maize.',
            'priority': 2,
            'to_number': '0780475911'}, 
        {'content': 'Other crops that significantly improve your soil quality include Grevillea Trees, Sweet Potatoes and Sunflowers.', 
            'priority': 2, 
            'to_number': '0780475911'}, 
        {'content': 'Why should we rotate our crops?\nA. To prevent pests and disease building up in our soil and have bigger harvests!\nB. To reduce soil health.', 'priority': 1, 'to_number': '0780475911'}]});
        expect(waitForResponse).toHaveBeenCalledWith(batch5ResponseHandler.handlerName);
    });
});
