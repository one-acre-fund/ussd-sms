var triggerService = require('./triggerService');
var trigger = require('../shared/triggerService');

jest.mock('../shared/triggerService');

describe('Nutrition training service', () => {
    it('it should start the service', () => {
        var lang = 'en-ke';
        var serviceId = 'v6BMW';
        contact.id = '387453';
        triggerService(lang, serviceId);
        expect(sayText).toHaveBeenCalledWith('A training SMS has been sent to your phone. Messages are free! But please delete unwanted SMS in your phone to make space for incoming.');
        expect(trigger).toHaveBeenCalledWith('v6BMW', {'contact_id': '387453', 'context': 'contact'});
        expect(contact.vars.lang).toEqual(lang);
    });
});
