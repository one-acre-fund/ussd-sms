const continueToOrderingHandler = require('./continueToOrderingHandler');
const enrollment = require('../../enrollment/enrollment');
const getClient = require('../../../shared/rosterApi/getClient');

jest.mock('../../../shared/rosterApi/getClient');
jest.mock('../../enrollment/enrollment');
jest.mock('../../../notifications/elk-notification/elkNotification');

describe('continue to ordering handler', () => {
    beforeEach(() => {
        state.vars.client_json = JSON.stringify({GroupId: 123});
        state.vars.registered_client_account = '2345234';
    });
    it('should stop the process when the user inputs zero', () => {
        const handler = continueToOrderingHandler.getHandler('en_bu');
        handler('0');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should start ordering once user chooses 1 and client retrieval was successfull and assign a groupId to the client', () => {
        getClient.mockReturnValueOnce({GroupId: null, AccountNumber: '123121'});

        const handler = continueToOrderingHandler.getHandler('en_bu');
        handler('1');
        expect(getClient).toHaveBeenCalledWith('2345234', 'BI');
        expect(enrollment.start).toHaveBeenCalledWith('en_bu', {GroupId: 123, AccountNumber: '123121'});
    });
});
