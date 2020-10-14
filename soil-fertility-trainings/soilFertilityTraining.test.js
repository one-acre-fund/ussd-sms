var Batch1ResponseHandler = require('./responseHandlers/batch1ResponseHandler');

describe('soil fertility training', () => {
    beforeAll(() => {
        global.contact = {vars: {lang: 'en-ke'}};
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should send the 1. batch messages', () => {
        contact.phone_number = '0555345';
        var lang = require('./soilFertilityTraining')();
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Today we are going learn how to get the best harvest from your soils. Healthy soils give great harvest! Soil is gold!',
                'start_time_offset': 0,
                'to_number': '0555345'});
        expect(project.scheduleMessage).toHaveBeenCalledWith(
            {'content': 'Each type of crop needs a different mix of nutrients for great harvests. Healthy soils provide a complete range of nutrients to plants.',
                'start_time_offset': 15,
                'to_number': '0555345'});
        expect(waitForResponse).toHaveBeenCalledWith(Batch1ResponseHandler.handlerName);
        expect(lang).toEqual('en-ke');
    });
});
