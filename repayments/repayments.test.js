let getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');
let getHealthyPathPercentage;
jest.mock('../healthy-path/utils/getHealthyPathPercentage');
jest.mock('../shared/rosterApi/getPhoneNumber');

const overpaidContact = {
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

const contactNotFullyPaid = {
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
const contactWithoutPhoneNumber = {
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
const fullyPaidClient = {
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
};
project.getOrCreateLabel.mockImplementation((label)=>({id: label}));

describe('mobile money repayments using', () => {
    var mockedRow = {save: jest.fn(),hasNext: jest.fn(() => true), next: jest.fn(),vars: {}, limit: jest.fn()}; 
    var mockedTable = { queryRows: () => mockedRow};
    beforeAll(() => {
        global.state = { vars: {} };
        contact.phone_number = '0755432334';
        project.vars.repayments_sms_route = '12345';
    });
    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockedTable);
        getHealthyPathPercentage = require('../healthy-path/utils/getHealthyPathPercentage');
        getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');
        project.sendMessage.mockClear();
    });

    it('should send an shs notification to an active phone once all the debt is paid', () => {
        getPhoneNumber.mockReturnValueOnce([ {PhoneNumber: '05423827342', IsInactive: true}, {PhoneNumber: '075342312', IsInactive: false}]);
        contact.vars = {
            accountnumber: '3033-cf74-f94a',
            lastTransactionAmount: 500,
            lastTransactionId: '5beb94c0-3033-cf74-f94a',
            client: JSON.stringify(fullyPaidClient)
        };
        require('./repayments');
        expect(getPhoneNumber).toHaveBeenCalledWith('10049849', 'kenya');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Thank you for finishing up your loan, you can now get your permanent code to unlock your solar home system by dialing *689#',
            'to_number': '075342312', 'label_ids': ['shs notification', 'English'], 'message_type': 'sms',
            'route_id': '12345'});
    });

    it('should send a message once there is an over payment', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.3);        
        contact.vars = overpaidContact;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a You completed your current loan. Last Payment: KSh 3000. Receipt number 5beb94c0-3033-cf74-f94a. Total Paid toward your next loan: Ksh 2000.',
            'to_number': '0755432334', 'label_ids': [
                'English',
                'MM receipt',
                'Business Operations',
                'Overpaid',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });

    it('should send a message  with health path message once there loan is not fullly paid', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.9);        
        contact.vars = contactNotFullyPaid;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hello Je-3033-cf74-f94a Last payment: KSh 3000. Receipt Number 5beb94c0-3033-cf74-f94a. Total paid KSh 14000. Balance KSh 6500. Pay 1500 to stay on the healthy path.',
            'to_number': '0755432334', 'label_ids': [
                'English',
                'MM receipt',
                'Business Operations',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });
    it('should send a message in swahili once there is no data in the EnglishDistricts', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        mockedRow.hasNext = jest.fn(() => false);        
        contact.vars = overpaidContact;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a Ulikamilisha malipo ya mkopo wa sasa. Malipo ya mwisho: KSh 3000. Nambari ya risiti 5beb94c0-3033-cf74-f94a. Malipo kwa ujumla kulipia mkopo unaofuata KSh 2000.',
            'to_number': '0755432334', 'label_ids': [
                'Swahili',
                'MM receipt',
                'Business Operations',
                'Overpaid'
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });
    it('should send a message to the account phone Number in swahili once there is no data in the EnglishDistricts', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        const accountPhoneNumber = '05423827342';
        getPhoneNumber.mockReturnValueOnce([ {PhoneNumber: accountPhoneNumber, IsInactive: false}]);
        mockedRow.hasNext = jest.fn(() => false);        
        contact.vars = overpaidContact;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledTimes(2);
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a Ulikamilisha malipo ya mkopo wa sasa. Malipo ya mwisho: KSh 3000. Nambari ya risiti 5beb94c0-3033-cf74-f94a. Malipo kwa ujumla kulipia mkopo unaofuata KSh 2000.',
            'to_number': accountPhoneNumber, 'label_ids': [
                'Swahili',
                'MM receipt',
                'Business Operations',
                'Overpaid',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });
    it('should send a message to the account phone Number in swahili once there is no data in the EnglishDistricts', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        const accountPhoneNumber = '05423827342';
        getPhoneNumber.mockReturnValueOnce([ {PhoneNumber: accountPhoneNumber, IsInactive: false}]);
        mockedRow.hasNext = jest.fn(() => false);        
        contact.vars = overpaidContact;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledTimes(2);
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a Ulikamilisha malipo ya mkopo wa sasa. Malipo ya mwisho: KSh 3000. Nambari ya risiti 5beb94c0-3033-cf74-f94a. Malipo kwa ujumla kulipia mkopo unaofuata KSh 2000.',
            'to_number': accountPhoneNumber, 'label_ids': [
                'Swahili',
                'MM receipt',
                'Business Operations',
                'Overpaid',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });
    it('should not send only one receipt if the account phone number is the same as the contact phonenumber ', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        const accountPhoneNumber = contact.phone_number;
        getPhoneNumber.mockReturnValueOnce([ {PhoneNumber: accountPhoneNumber, IsInactive: false}]);
        mockedRow.hasNext = jest.fn(() => false);        
        contact.vars = overpaidContact;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledTimes(1);
    });
    
    it('should log an error once the phone number is not found', () => {
        mockedRow.hasNext = jest.fn(() => false);
        var logger = require('../slack-logger/index');
        jest.mock('../slack-logger/index');
        jest.spyOn(logger, 'log');
        
        contact.vars = contactWithoutPhoneNumber;
        require('./repayments');
        expect(logger.log).toHaveBeenCalledWith('error in shs notification: could not get a to_phone number from roster');
    });

    it('should validate the project variables', () => {
        mockedRow.hasNext = jest.fn(() => false);
        var validateProjectVatiables = require('./validateProjectVariables');
        jest.mock('./validateProjectVariables');
        
        require('./repayments');
        
        expect(validateProjectVatiables).toHaveBeenCalledWith('dev');
    });
    
    it('should validate the project variables', () => {
        service.active = true;
        service.vars = {};
        mockedRow.hasNext = jest.fn(() => false);
        var validateProjectVatiables = require('./validateProjectVariables');
        jest.mock('./validateProjectVariables');        
        require('./repayments');        
        expect(validateProjectVatiables).toHaveBeenCalledWith('prod');
    });
    it('should send a message preferrably to phonenumberTypeID that is higher', () => {
        getHealthyPathPercentage.mockReturnValueOnce(0.3);
        const otherAccountPhoneNumber = '05423827342';
        const preferredAccountPhoneNumber = '012345678';
        const preferredAccountContact = { PhoneNumber: preferredAccountPhoneNumber, PhoneNumberTypeId: 1, IsInactive: false };
        const otherAccountContact = { PhoneNumber: otherAccountPhoneNumber, PhoneNumberTypeId: 1, IsInactive: false };
        getPhoneNumber.mockReturnValueOnce([ otherAccountContact,preferredAccountContact]);
        mockedRow.hasNext = jest.fn(() => false);        
        contact.vars = overpaidContact;
        require('./repayments');
        expect(project.sendMessage).toHaveBeenCalledTimes(2);
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Je-3033-cf74-f94a Ulikamilisha malipo ya mkopo wa sasa. Malipo ya mwisho: KSh 3000. Nambari ya risiti 5beb94c0-3033-cf74-f94a. Malipo kwa ujumla kulipia mkopo unaofuata KSh 2000.',
            'to_number': preferredAccountPhoneNumber, 'label_ids': [
                'Swahili',
                'MM receipt',
                'Business Operations',
                'Overpaid',
            ], 'message_type': 'sms',
            'route_id': '12345'});
    });
});
