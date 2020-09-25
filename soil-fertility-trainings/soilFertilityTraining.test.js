var Batch1ResponseHandler = require('./responseHandlers/batch1ResponseHandler');

describe('soil fertility training', () => {
    beforeAll(() => {
        global.contact = {vars: {lang: 'en-ke'}};
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should send the 1. batch messages', () => {
        jest.mock('./responseHandlers/addResponseHandlers');
        contact.phone_number = '0555345';
        var lang = require('./soilFertilityTraining')();
        expect(project.sendMulti).toHaveBeenCalledWith({'message_type': 'text', 'messages': [
            {'content': 'Today we are going learn how to get the best harvest from your soils. Healthy soils give great harvest! Soil is gold!', 'to_number': '0555345'}, 
            {'content': 'Each type of crop needs a different mix of nutrients for great harvests. Healthy soils provide a complete range of nutrients to plants.', 'to_number': '0555345'}
        ]});
        expect(waitForResponse).toHaveBeenCalledWith(Batch1ResponseHandler.handlerName);
        expect(lang).toEqual('en-ke');
    });
});
