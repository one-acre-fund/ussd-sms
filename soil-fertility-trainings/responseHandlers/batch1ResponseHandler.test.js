const batch1ResponseHandler = require('./batch1ResponseHandler');
const batch2ResponseHandler = require('./batch2ResponseHandler');

describe('batch1 messages response handler', () => {
    it('should send all 2 messages once the user responds to the batch 1 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch1Handler = batch1ResponseHandler.getHandler(lang);
        batch1Handler();
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'First, let\'s learn about the different types of soils. Every type of soil is made up of three main parts: sand, silt and clay.',
                'to_number': '0780475911',
                'start_time_offset': 0,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Soils with equal amount of sand, silt and clay are called loam soils. These are the best type of soils.',
                'to_number': '0780475911',
                'start_time_offset': 15,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Sandy soils have more sand, drains water easily and are not very fertile. Clay soils have more clay and drains poorly when wet.',
                'to_number': '0780475911',
                'start_time_offset': 30,});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'All types of soils need to be improved for you to have great harvests. You can improve your soil by adding organic matter!',
                'to_number': '0780475911',
                'start_time_offset': 45,});
        expect(waitForResponse).toHaveBeenCalledWith(batch2ResponseHandler.handlerName);
    });
});
