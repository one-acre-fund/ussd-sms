const getClient = require('../../shared/rosterApi/getClient');
const Enrollment = require('../enrollment/enrollment');
const preEnrollmentHandler = require('./preEnrollmentHandler');
const reduceClientSize = require('../../shared/reduceClientSize');

jest.mock('../../shared/rosterApi/getClient');
jest.mock('../enrollment/enrollment');
jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../../shared/reduceClientSize');

describe('pre enrollment', () => {
    beforeAll(() => {
        state.vars.client_json = JSON.stringify({GroupId: 1234});
        project.vars.country = 'BI';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should reprompt if client is not authenticated on roster', () => {
        getClient.mockReturnValueOnce(null);
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(getClient).toHaveBeenCalledWith('123434', 'BI');
        expect(sayText).toHaveBeenCalledWith('Enter the account number of the farmer you want to order for');
        expect(promptDigits).toHaveBeenCalledWith(preEnrollmentHandler.handlerName);
    });
    it('should start the enrollment if the farmer to be enrolled is new (has no group id) and assign ', () => {
        reduceClientSize.mockReturnValueOnce({AccountNumber: '34534', GroupId: null});
        getClient.mockReturnValueOnce({AccountNumber: '34534', GroupId: null});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', {AccountNumber: '34534', 'GroupId': null});
    });

    it('should start the enrollment if the farmer to be enrolled is not new (has a group id) that matched the group leader\'s', () => {
        getClient.mockReturnValueOnce({GroupId: 1234});
        reduceClientSize.mockReturnValueOnce({GroupId: 1234});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', {'GroupId': 1234});
    });

    it('should reprompt if there is a non matching group code', () => {
        reduceClientSize.mockReturnValueOnce({GroupId: 4321});
        getClient.mockReturnValueOnce({GroupId: 4321});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(sayText).toHaveBeenCalledWith('The farmer is not in your group\n' +
        'Enter the account number of the farmer you want to order for');
        expect(promptDigits).toHaveBeenCalledWith(preEnrollmentHandler.handlerName);
    });
});
