var triggerService = require('./triggerService');

describe('Maize recommendation service', () => {
    it('it should start the service', () => {
        var trigger = jest.fn();
        var lang = 'en-ke';
        var serviceId = 'v6BMW';
        triggerService(lang, trigger, serviceId);
        expect(sayText).toHaveBeenCalledWith('A SMS has been sent to your phone. Messages are free! But please delete unwanted SMS in your phone to make space for incoming.');
        expect(trigger).toHaveBeenCalledWith(serviceId);
        expect(stopRules).toHaveBeenCalled();
    });
});
