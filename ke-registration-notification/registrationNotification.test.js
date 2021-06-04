const Log = require('../logger/elk/elk-logger');
jest.mock('../logger/elk/elk-logger');

describe('Registration Notification SMS Error', () => {
    it('logs the error if there is an exception while sending the message', () => {
        const mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        Log.mockReturnValue(mockLogger);
        contact.vars = null;
        require('./registrationNotification');
        expect(mockLogger.error).toHaveBeenCalled();
    });
});

describe('Registration Notification SMS', () => {
    beforeAll(() => {
        global.contact = {
            phone_number: '0755432334',
            vars: {
                firstName: 'John',
                accountnumber: '0132345432'
            }
        };
        project.vars.repayments_sms_route = '12345';
    });

    beforeEach(() => {
        jest.resetModules();
    });

    it('sends an sms to the registered client', () => {
        contact.vars.lang = 'en';
        require('./registrationNotification');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hello John, thank you for joining One Acre Fund! Begin paying toward your loan now by making a payment via MPESA with your Account Number (0132345432). Your FO will follow up with you.',
            'to_number': '0755432334',
            'route_id': '12345',
            'message_type': 'sms'
        });
    });

    it('sends an sms to the registered client in english if lang is en-ke', () => {
        contact.vars.lang = 'en-ke';
        require('./registrationNotification');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hello John, thank you for joining One Acre Fund! Begin paying toward your loan now by making a payment via MPESA with your Account Number (0132345432). Your FO will follow up with you.',
            'to_number': '0755432334',
            'route_id': '12345',
            'message_type': 'sms'
        });
    });
});