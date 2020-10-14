const batch2ResponseHandler = require('./batch2ResponseHandler');
const batch3ResponseHandler = require('./batch3ResponseHandler');

describe('batch 2 messages response handler', () => {
    it('should send all 5 batch 3 messages once the user responds to the batch 2 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch2Handler = batch2ResponseHandler.getHandler(lang);
        batch2Handler();
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Soil organic matter is made of plant and animal material put back into the soil. Examples are animal waste, plant residues and compost.',
                'to_number': '0780475911',
                'start_time_offset': 0,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Organic matter contains many special nutrients and increases soil\'s ability to hold water like a sponge. It can also reduce soil acidity.',
                'to_number': '0780475911',
                'start_time_offset': 15,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Add organic matter back to the soil each year. This allows your soil to stay rich and healthy for next year\'s crop.',
                'to_number': '0780475911',
                'start_time_offset': 30,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Remember, unlike fertilizer, organic matter stays in the soil for many years - it is a long term improvement!',
                'to_number': '0780475911',
                'start_time_offset': 45,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'There are many ways to improve your soil organic matter. We will learn about composting, crop rotation, planting legumes and using lime. respond with "continue" for next message',
                'to_number': '0780475911',
                'start_time_offset': 60,});
        expect(waitForResponse).toHaveBeenCalledWith(batch3ResponseHandler.handlerName);
    });
});
