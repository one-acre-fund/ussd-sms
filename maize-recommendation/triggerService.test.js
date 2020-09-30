var triggerService = require('./triggerService');
var trigger = require('../shared/triggerService');

jest.mock('../shared/triggerService');

describe('Maize recommendation service', () => {
    it('it should start the service', () => {
        var lang = 'en-ke';
        var serviceId = 'v6BMW';
        contact.id = '387453';
        triggerService(lang, serviceId);
        expect(sayText).toHaveBeenCalledWith('A SMS has been sent to your phone. Messages are free! But please delete unwanted SMS in your phone to make space for incoming.');
        expect(trigger).toHaveBeenCalledWith('v6BMW', {'contact_id': '387453', 'context': 'contact'});
        expect(stopRules).toHaveBeenCalled();
    });
});
