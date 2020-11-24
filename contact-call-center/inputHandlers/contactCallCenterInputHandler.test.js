const contactCallCenter = require('./contactCallCenterInputHandler');
const callBackTimeCheck = require('../utils/callBackTimeCheck');
var createTicket = require('../../zd-legacy/lib/create-ticket');
var logger = require('../../logger/elk/elk-logger');

jest.mock('../utils/callBackTimeCheck');
jest.mock('../../zd-legacy/lib/create-ticket');
jest.mock('../../logger/elk/elk-logger');

describe('contact call center input handler', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should tell users once they report duplicate request', () => {
        state.vars.ccc_options = JSON.stringify({1: 'option1'});
        state.vars.ccc_screens = JSON.stringify({1: 'screen1'});
        callBackTimeCheck.mockReturnValueOnce(true);
        const handler = contactCallCenter.getHandler('en-ke');
        handler('1');
        expect(sayText).toHaveBeenCalledWith('You have already placed a similar request. We assure you that you will be contacted. Please be available. Thank you for the patience.');
    });

    it('should show the next menu once the users enter 77', () => {
        state.vars.ccc_options = JSON.stringify({1: 'option1'});
        state.vars.ccc_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.ccc_current_screen = 1;
        callBackTimeCheck.mockReturnValueOnce(true);
        const handler = contactCallCenter.getHandler('en-ke');
        handler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
    });

    it('should reprompt for the call center option once the user select an invalid option', () => {
        state.vars.ccc_options = JSON.stringify({1: 'option1'});
        state.vars.ccc_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.ccc_current_screen = 1;
        callBackTimeCheck.mockReturnValueOnce(true);
        const handler = contactCallCenter.getHandler('en-ke');
        handler('1230');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(contactCallCenter.handlerName);
    });

    it('should confirm the reception of the request once the ticket is created', () => {
        callBackTimeCheck.mockReturnValueOnce(false);
        createTicket.mockReturnValueOnce(true);
        state.vars.client = JSON.stringify({AccountNumber: 12345});
        state.vars.ccc_options = JSON.stringify({1: 'option1'});
        state.vars.ccc_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.ccc_current_screen = 1;
        const handler = contactCallCenter.getHandler('en-ke');
        handler('1');
        expect(sayText).toHaveBeenCalledWith('You will contacted by our customer service representative within 48 hours. Do not switch off  this phone or place a duplicate request.');
    });

    it('should should reprompt for the call option once the tocket is not successfully created', () => {
        callBackTimeCheck.mockReturnValueOnce(false);
        createTicket.mockReturnValueOnce(false);
        const mockLogger = {
            error: jest.fn(),
        };
        logger.mockReturnValue(mockLogger);
        state.vars.client = JSON.stringify({AccountNumber: 12345});
        state.vars.ccc_options = JSON.stringify({1: 'option1'});
        state.vars.ccc_screens = JSON.stringify({1: 'screen1', 2: 'screen2'});
        state.vars.ccc_current_screen = 1;
        const handler = contactCallCenter.getHandler('en-ke');
        handler('1');
        expect(mockLogger.error).toHaveBeenCalledWith('zendesk ticket creation failed for12345', 
            {'data': {'phone': undefined, 'reportedIssue': 'Call back requested for: option1 account number : 12345',
                'requester': 12345}, 
            'tags': ['zendesk', 'ke-legacy', 'option1']});
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(contactCallCenter.handlerName);
    });
});
