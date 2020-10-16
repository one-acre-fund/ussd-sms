var triggerService = require('./triggerService');
var trigger = require('../shared/triggerService');

jest.mock('../shared/triggerService');
describe('soil fertility training service', () => {
    it('it should start the service', () => {
        var lang = 'en-ke';
        var serviceId = 'v6BMW';
        triggerService(lang, serviceId);
        expect(sayText).toHaveBeenCalledWith('A training SMS has been sent to your phone. Messages are free! But please delete unwanted SMS in your phone to make space for incoming.');
        expect(trigger).toHaveBeenCalledWith(serviceId, {'contact_id': undefined, 'context': 'contact'});
        expect(contact.vars.lang).toEqual(lang);
    });
});
