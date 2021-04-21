const rosterAPI = require('../../rw-legacy/lib/roster/api');
const Enrollment = require('../enrollment/enrollment');
const preEnrollmentHandler = require('./preEnrollmentHandler');

jest.mock('../../rw-legacy/lib/roster/api');
jest.mock('../enrollment/enrollment');

describe('pre enrollment', () => {
    beforeAll(() => {
        state.vars.client_json = JSON.stringify({GroupId: 1234});
        project.vars.country = 'BI';
    });
    it('should reprompt if client is not authenticated on roster', () => {
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce(null);
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(rosterAPI.getClient).toHaveBeenCalledWith('123434', 'BI');
        expect(sayText).toHaveBeenCalledWith('Enter the account number of the farmer you want to order for');
        expect(promptDigits).toHaveBeenCalledWith(preEnrollmentHandler.handlerName);
    });
    it('should start the enrollment if the farmer to be enrolled is new (has no group id) and assign ', () => {
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce({AccountNumber: '34534', GroupId: null});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', {AccountNumber: '34534', 'GroupId': 1234});
    });

    it('should start the enrollment if the farmer to be enrolled is not new (has a group id) that matched the group leader\'s', () => {
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce({GroupId: 1234});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', {'GroupId': 1234});
    });

    it('should reprompt if there is a non matching group code', () => {
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce({GroupId: 4321});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(sayText).toHaveBeenCalledWith('The farmer is not in your group\n' +
        'Enter the account number of the farmer you want to order for');
        expect(promptDigits).toHaveBeenCalledWith(preEnrollmentHandler.handlerName);
    });
});
