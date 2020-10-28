
describe('mobile money repayments using', () => {
    beforeAll(() => {
        global.state = { vars: {} };
        contact.phone_number = '0755432334';
        project.vars.repayments_sms_route = '12345';
    });
    beforeEach(() => {
        jest.resetModules();
    });
    var mockedRow = {save: jest.fn(),hasNext: jest.fn(() => true), next: jest.fn(),vars: {}, limit: jest.fn()}; 
    var mockedTable = { queryRows: () => mockedRow};

    it('should send an shs notification to an active phone once all the debt is paid', () => {
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        const getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');
        jest.mock('../shared/rosterApi/getPhoneNumber');
        getPhoneNumber.mockReturnValueOnce([ {PhoneNumber: '05423827342', IsInactive: true}, {PhoneNumber: '075342312', IsInactive: false}]);
        contact.vars = {
            accountnumber: '3033-cf74-f94a',
            lastTransactionAmount: 500,
            lastTransactionId: '5beb94c0-3033-cf74-f94a',
            client: JSON.stringify({
                'FirstName': 'Je',
                'CountryName': 'kenya',
                'AccountNumber': '10049849',             
                'BalanceHistory': [
                    {
                        'TotalCredit': 10000.000,
                        'TotalRepayment_IncludingOverpayments': 10000.0000,
                        'Balance': 0,
                    },
                    {
                        'TotalCredit': 5500,
                        'TotalRepayment_IncludingOverpayments': 5500,
                        'Balance': 0,
                    }
                ]
            })
        };
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'shs notification'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'lang'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValue({});
        require('./repayments');
        expect(getPhoneNumber).toHaveBeenCalledWith('10049849', 'kenya');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Thank you for finishing up your loan, you can now get your permanent code to unlock your solar home system by dialing *689#',
            'to_number': '075342312', 'label_ids': ['shs notification', 'lang'], 'message_type': 'sms',
            'route_id': '12345'});
    });

    it('should send a message once there is an over payment', () => {
        const getHealthyPathPercentage = require('../healthy-path/utils/getHealthyPathPercentage');
        jest.mock('../healthy-path/utils/getHealthyPathPercentage');
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'lang'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'MM receipt'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'Business Operations'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'Overpaid'});

        contact.vars = {
            accountnumber: '3033-cf74-f94a',
            lastTransactionAmount: 3000,
            lastTransactionId: '5beb94c0-3033-cf74-f94a',
            client: JSON.stringify({
                'FirstName': 'Je',              
                'BalanceHistory': [
                    {
                        'TotalCredit': 10000.000,
                        'TotalRepayment_IncludingOverpayments': 12000.0000,
                        'Balance': 0,
                    },
                    {
                        'TotalCredit': 5500,
                        'TotalRepayment_IncludingOverpayments': 2000,
                        'Balance': 3500,
                    }
                ]
            })
        };
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a You completed your current loan. Last Payment: KSh 3000. Receipt number 5beb94c0-3033-cf74-f94a. Total Paid toward your next loan: Ksh 2000.',
            'to_number': '0755432334', 'label_ids': [
                'lang',
                'MM receipt',
                'Business Operations',
                'Overpaid',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });

    it('should send a message  with health path message once there loan is not fullly paid', () => {
        const getHealthyPathPercentage = require('../healthy-path/utils/getHealthyPathPercentage');
        jest.mock('../healthy-path/utils/getHealthyPathPercentage');
        getHealthyPathPercentage.mockReturnValueOnce(0.9);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'lang'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'MM receipt'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'Business Operations'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'Overpaid'});

        contact.vars = {
            accountnumber: '3033-cf74-f94a',
            lastTransactionAmount: 3000,
            lastTransactionId: '5beb94c0-3033-cf74-f94a',
            client: JSON.stringify({
                'FirstName': 'Je',              
                'BalanceHistory': [
                    {
                        'TotalCredit': 15000.000,
                        'TotalRepayment_IncludingOverpayments': 12000.000,
                        'Balance': 3000,
                    },
                    {
                        'TotalCredit': 5500,
                        'TotalRepayment_IncludingOverpayments': 2000,
                        'Balance': 3500,
                    }
                ]
            })
        };
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hello Je-3033-cf74-f94a Last payment: KSh 3000. Receipt Number 5beb94c0-3033-cf74-f94a. Total paid KSh 14000. Balance KSh 6500. Pay 1500 to stay on the healthy path.',
            'to_number': '0755432334', 'label_ids': [
                'lang',
                'MM receipt',
                'Business Operations',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });
    it('should send a message in swahili once there is no data in the EnglishDistricts', () => {
        const getHealthyPathPercentage = require('../healthy-path/utils/getHealthyPathPercentage');
        jest.mock('../healthy-path/utils/getHealthyPathPercentage');
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        mockedRow.hasNext = jest.fn(() => false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'lang'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'MM receipt'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'Business Operations'});
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: 'Overpaid'});
        contact.vars = {
            accountnumber: '3033-cf74-f94a',
            lastTransactionAmount: 3000,
            lastTransactionId: '5beb94c0-3033-cf74-f94a',
            client: JSON.stringify({
                'FirstName': 'Je',              
                'BalanceHistory': [
                    {
                        'TotalCredit': 10000.000,
                        'TotalRepayment_IncludingOverpayments': 12000.0000,
                        'Balance': 0,
                    },
                    {
                        'TotalCredit': 5500,
                        'TotalRepayment_IncludingOverpayments': 2000,
                        'Balance': 3500,
                    }
                ]
            })
        };
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a Ulikamilisha malipo ya mkopo wa sasa. Malipo ya mwisho: KSh 3000. Nambari ya risiti 5beb94c0-3033-cf74-f94a. Malipo kwa ujumla kulipia mkopo unaofuata KSh 2000.',
            'to_number': '0755432334', 'label_ids': [
                'Overpaid',
                'lang',
                'MM receipt',
                'Business Operations',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });

    it('should log an error once the phone number is not found', () => {
        mockedRow.hasNext = jest.fn(() => false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        var logger = require('../slack-logger/index');
        jest.mock('../slack-logger/index');
        jest.spyOn(logger, 'log');

        contact.vars = {
            accountnumber: '3033-cf74-f94a',
            lastTransactionAmount: 3000,
            lastTransactionId: '5beb94c0-3033-cf74-f94a',
            client: JSON.stringify({
                'FirstName': 'Je',              
                'BalanceHistory': [
                    {
                        'TotalCredit': 10000.000,
                        'TotalRepayment_IncludingOverpayments': 12000.0000,
                        'Balance': 0,
                    },
                    {
                        'TotalCredit': 5500,
                        'TotalRepayment_IncludingOverpayments': 2000,
                        'Balance': 0,
                    }
                ]
            })
        };
        require('./repayments');
        expect(logger.log).toHaveBeenCalledWith('error in shs notification: could not get a to_phone number from roster');
    });

    it('should validate the project variables', () => {
        mockedRow.hasNext = jest.fn(() => false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        var validateProjectVatiables = require('./validateProjectVariables');
        jest.mock('./validateProjectVariables');

        require('./repayments');
        
        expect(validateProjectVatiables).toHaveBeenCalledWith('dev');
    });

    it('should validate the project variables', () => {
        service.active = true;
        service.vars = {};
        mockedRow.hasNext = jest.fn(() => false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        var validateProjectVatiables = require('./validateProjectVariables');
        jest.mock('./validateProjectVariables');

        require('./repayments');
        
        expect(validateProjectVatiables).toHaveBeenCalledWith('prod');
    });
});
