const callBackTimeCheck = require('../../contact-call-center/utils/callBackTimeCheck');
const scheduleCall = require('./scheduleCall');
const createTicket = require('../../zd-legacy/lib/create-ticket');
const logger = require('../../logger/elk/elk-logger');

jest.mock('../../contact-call-center/utils/callBackTimeCheck');
jest.mock('../../zd-legacy/lib/create-ticket');
jest.mock('../../logger/elk/elk-logger');

describe('schedule call back', () => {
    const callInfo = {
        lang: 'en',
        desc:
            'Call back requested for forgotten pin. User phone number is 07812345678',
        accountNumber: '1234567',
        phoneNumber: '07812345678',
        successMsg: 'OAF_call',
        repeatMenu: 'pin_menu',
        repeatHandler: 'pin_menu',
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should show the success message when ticket is successfully created', () => {
        callBackTimeCheck.mockReturnValueOnce(false);
        createTicket.mockReturnValueOnce(true);
        scheduleCall(callInfo);
        expect(sayText).toHaveBeenCalledWith(
            'You will receive a call from OAF in 24 hours for assistance with this issue'
        );
    });

    it('should show the repeat menu when ticket is not successfully created', () => {
        callBackTimeCheck.mockReturnValueOnce(false);
        createTicket.mockReturnValueOnce(false);
        const mockLogger = {
            error: jest.fn(),
        };
        logger.mockReturnValue(mockLogger);
        scheduleCall(callInfo);
        expect(
            mockLogger.error
        ).toHaveBeenCalledWith('zendesk ticket creation failed for 1234567', {
            data: {
                phone: '07812345678',
                reportedIssue:
                    'Call back requested for forgotten pin. User phone number is 07812345678',
                requester: '1234567',
            },
            tags: [
                'zendesk',
                'ke-legacy',
                'Call back requested for forgotten pin. User phone number is 07812345678',
            ],
        });
        expect(sayText).toHaveBeenCalledWith(
            'Enter your PIN\n1) Enter PIN\n2) I forgot my PIN\n3) Back'
        );
        expect(promptDigits).toHaveBeenCalledWith(callInfo.repeatHandler);
    });

    it('should alert users once they report duplicate request within 24 hours', () => {
        callBackTimeCheck.mockReturnValueOnce(true);
        scheduleCall(callInfo);
        expect(sayText).toHaveBeenCalledWith(
            'You have already placed a similar request. We assure you that you will be contacted. Please be available. Thank you for the patience.'
        );
    });
});
