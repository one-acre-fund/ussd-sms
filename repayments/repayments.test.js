describe('mobile money repayments', () => {
    beforeAll(() => {
        global.state = { vars: {} };
        contact.phone_number = '0755432334';
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
        require('./repayments');
        expect(getPhoneNumber).toHaveBeenCalledWith('10049849', 'kenya');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Thank you for finishing up your loan, you can now get your permanent code to unlock your solar home system by dialing *689#',
            'to_number': '075342312'});
        expect(project.sendMessage).not.toHaveBeenCalledWith({'content': 'Thank you for finishing up your loan, you can now get your permanent code to unlock your solar home system by dialing *689#',
            'to_number': '05423827342'});
    });

    it('should send a message once there is an over payment', () => {
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        
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
            'to_number': '0755432334'});
    });

    it('should send a message in swahili once there is no data in the EnglishDistricts', () => {
        mockedRow.hasNext = jest.fn(() => false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        
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
            'to_number': '0755432334'});
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
