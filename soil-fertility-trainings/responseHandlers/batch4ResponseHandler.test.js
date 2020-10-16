const batch4ResponseHandler = require('./batch4ResponseHandler');
const batch5ResponseHandler = require('./batch5ResponseHandler');

describe('batch 4 messages response handler', () => {
    it('should send all 5 batch 5 messages once the user responds to the batch 4 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch4Handler = batch4ResponseHandler.getHandler(lang);
        batch4Handler();

        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'You can also improve the quality of soil by planting legumes like beans, groundnuts, that put nutrients to your soil when they are growing.',
                'to_number': '0780475911',
                'start_time_offset': 0,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'You can intercrop these crops with your maize in the long rains season, or practice crop rotation.',
                'to_number': '0780475911',
                'start_time_offset': 15,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'To practice crop rotation, avoid planting the same crop on the same piece of land every year. Rotate legumes with cereals like maize.',
                'to_number': '0780475911',
                'start_time_offset': 30,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Other crops that significantly improve your soil quality include Grevillea Trees, Sweet Potatoes and Sunflowers.',
                'to_number': '0780475911',
                'start_time_offset': 45,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Why should we rotate our crops?\nA. To prevent pests and disease building up in our soil and have bigger harvests!\nB. To reduce soil health.',
                'to_number': '0780475911',
                'start_time_offset': 60,});
        expect(waitForResponse).toHaveBeenCalledWith(batch5ResponseHandler.handlerName);
    });
});
