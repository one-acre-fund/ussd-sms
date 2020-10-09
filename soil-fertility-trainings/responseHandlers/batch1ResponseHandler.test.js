const batch1ResponseHandler = require('./batch1ResponseHandler');
const batch2ResponseHandler = require('./batch2ResponseHandler');

describe('batch1 messages response handler', () => {
    it('should send all 2 messages once the user responds to the batch 1 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch1Handler = batch1ResponseHandler.getHandler(lang);
        batch1Handler();
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': [
            {'content': 'First, let\'s learn about the different types of soils. Every type of soil is made up of three main parts: sand, silt and clay.',
                'priority': 2, 'to_number': '0780475911'},
            {'content': 'Soils with equal amount of sand, silt and clay are called loam soils. These are the best type of soils.',
                'priority': 2, 'to_number': '0780475911'}, 
            {'content': 'Sandy soils have more sand, drains water easily and are not very fertile. Clay soils have more clay and drains poorly when wet.',
                'priority': 2, 'to_number': '0780475911'}, 
            {'content': 'All types of soils need to be improved for you to have great harvests. You can improve your soil by adding organic matter!',
                'priority': 2, 'to_number': '0780475911'}]});
        expect(waitForResponse).toHaveBeenCalledWith(batch2ResponseHandler.handlerName);
    });
});
