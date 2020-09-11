var triggerService = require('./triggerService');
var slacLogger = require('../slack-logger/index');

jest.mock('../slack-logger/index');

describe('services trigger', () => {
    it('should trigger a service successfully', () => {
        const newService = {invoke: jest.fn()};
        jest.spyOn(project, 'initServiceById').mockReturnValueOnce(newService);
        jest.spyOn(newService, 'invoke');
        const options = {context: 'contact',contact_id: '34h3iaq7a'};
        triggerService('SV23234hjsiiuw', options);
        expect(newService.invoke).toHaveBeenCalledWith(options);
    });

    it('should trigger a service successfully', () => {
        const newService = {invoke: jest.fn()};
        jest.spyOn(project, 'initServiceById').mockReturnValueOnce(newService);
        jest.spyOn(newService, 'invoke').mockImplementationOnce(() => {throw('can not trigger a non active service');});
        const options = {context: 'contact',contact_id: '34h3iaq7a'};
        triggerService('SV23234hjsiiuw', options);
        expect(slacLogger.log).toHaveBeenCalledWith('Error triggering service: SV23234hjsiiuw\n{"error":"can not trigger a non active service"}');
    });
});