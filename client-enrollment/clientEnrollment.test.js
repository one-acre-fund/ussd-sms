const clientEnrollment = require('./clientEnrollment');
const roster = require('../rw-legacy/lib/roster/api');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
var clientRegistration = require('../client-registration/clientRegistration');

jest.mock('../rw-legacy/lib/roster/api');
jest.mock('../Roster-endpoints/Fo-info/getFoInfo');
jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('../client-registration/clientRegistration');
const account = 123456789;
const country = 'KE';
const enr_lang = 'en-ke';
const foPhone = '0786182098';
var mockTable = { createRow: jest.fn(), queryRows: jest.fn()};
var mockRow = {save: jest.fn(),next: jest.fn(), hasNext: jest.fn(),vars: {'account_number': account}};
describe('clientRegistration', () => {
    beforeAll(()=>{
        roster.getClient = jest.fn();
        roster.authClient = jest.fn();
        project.sendMessage = jest.fn();
        mockTable.createRow.mockReturnValue(mockRow);
        project.initDataTableById = jest.fn().mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockRow);
        mockRow.hasNext.mockReturnValue(false);
        mockRow.next.mockReturnValue(mockRow);
        clientRegistration.onContinueToEnroll = jest.fn().mockImplementationOnce(() => {
            return true;
        });
    });
    beforeEach(()=>{
        roster.authClient = jest.fn().mockImplementationOnce(() => {
            return true;
        });
    });
    it('should have a start function', () => {
        expect(clientEnrollment.start).toBeInstanceOf(Function);
    });

    describe('start', () => {
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.enr_lang = enr_lang;
            clientEnrollment.start(account, country,enr_lang);
            expect(state.vars).toMatchObject({account,country,enr_lang});
        });
        it('should call notifyELK on start function', () => {
            clientEnrollment.start(account, country,enr_lang); 
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should call roster.authClient', () => {
            clientEnrollment.start(account, country, enr_lang);
            expect(roster.authClient).toHaveBeenCalledTimes(1);
        });

        it('should call roster.getClinet if roster.authClient returns true', () => {
            clientEnrollment.start(account, country, enr_lang);
            expect(roster.getClient).toHaveBeenCalledTimes(1);
        });
        xit('should send a message if loan is fully paid',()=>{
            var {client}  = require('./test-client-data'); 
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            getFOInfo.mockImplementationOnce(() => {return {
                'firstName': 'sabin',
                'lastName': 'sheja',
                'phoneNumber': foPhone
            };});
            contact.phone_number = '0789098965';
            clientEnrollment.start(account, country, enr_lang);
            expect(project.sendMessage).toHaveBeenCalledWith({
                content: `Thank you for enrolling with One Acre Fund. Please follow-up with the Field Officer (FO) to add inputs. You can also call the FO on ${foPhone}`, 
                to_number: contact.phone_number
            });
        });
        xit('should send a message without FO contact if loan is fully paid and foinfo.phoneNumber is null',()=>{
            var {client}  = require('./test-client-data'); 
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            getFOInfo.mockImplementationOnce(() => {return {
                'firstName': 'sabin',
                'lastName': 'sheja',
                'phoneNumber': null
            };});
            clientEnrollment.start(account, country, enr_lang);
            expect(project.sendMessage).toHaveBeenCalledWith({
                content: 'Thank you for expressing your interest to enroll with OAF. Your FO will reach out to you to add inputs to your order.', 
                to_number: contact.phone_number
            });
        });
        xit('should show a message without FO contact if loan is fully paid and foinfo.phoneNumber is null',()=>{
            var {client}  = require('./test-client-data'); 
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            getFOInfo.mockImplementationOnce(() => {return {
                'firstName': 'sabin',
                'lastName': 'sheja',
                'phoneNumber': null
            };});
            clientEnrollment.start(account, country, enr_lang);
            expect(sayText).toHaveBeenCalledWith('Thank you for expressing your interest to enroll with OAF. Your FO will reach out to you to add inputs to your order.');
        });
        xit('should send a message without FO contact if loan is fully paid and foinfo is null',()=>{
            var {client}  = require('./test-client-data'); 
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            getFOInfo.mockImplementationOnce(() => {return null;});
            clientEnrollment.start(account, country, enr_lang);
            expect(project.sendMessage).toHaveBeenCalledWith({
                content: 'Thank you for expressing your interest to enroll with OAF. Your FO will reach out to you to add inputs to your order.', 
                to_number: contact.phone_number
            });
        });
        xit('should show a message without FO contact if loan is fully paid and foinfo is null',()=>{
            var {client}  = require('./test-client-data'); 
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            getFOInfo.mockImplementationOnce(() => {return null;});
            clientEnrollment.start(account, country, enr_lang);
            expect(sayText).toHaveBeenCalledWith('Thank you for expressing your interest to enroll with OAF. Your FO will reach out to you to add inputs to your order.');
        });
        it('should save a row with client info if loan is fully paid',()=>{
            var {client}  = require('./test-client-data'); 
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            getFOInfo.mockImplementationOnce(() => {return {
                'firstName': 'sabin',
                'lastName': 'sheja',
                'phoneNumber': foPhone
            };});
            contact.phone_number = '0789098965';
            clientEnrollment.start(account, country, enr_lang);
            expect(mockTable.createRow).toHaveBeenCalledWith({
                'contact_id': contact.id,
                'from_number': contact.from_number,
                'vars': {
                    'account_number': client.AccountNumber,
                    'national_id': client.NationalId,
                    'new_client': '0'
                }
            });
            expect(mockRow.save).toHaveBeenCalled();
        });

        it('should display loan_payment_not_satisfied if the minimum loan is not satisfied ', () => {
            var {client}  = require('./test-client-with-loan');
            client.BalanceHistory[0].TotalCredit = 100;
            client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 0;
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            var loanAmount = 100;
            clientEnrollment.start(account, country, enr_lang);
            expect(sayText).toHaveBeenCalledWith(`Thank you for expressing your interest to enrol for 2021. Please pay KSHs ${loanAmount} `+
            'to finish your loan then try again!');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        xit('should display a message with an account number if a duplicate account number is found in the tables', () => {
            mockRow.hasNext.mockReturnValue(true);
            clientEnrollment.start(account, country,enr_lang);
            expect(sayText).toHaveBeenCalledWith(`You have already enrolled this season and your account number is ${account}`+
            '. Reach out to your FO to help you add inputs to your order.');
        });
        it('should call on continue to enroll if the account number is not in 2021 Long rain', () => {
            var {client}  = require('./test-client-with-loan');
            client.BalanceHistory[0].SeasonName = '2020, Long Rain';
            client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 10000;
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            clientEnrollment.start(account, country,enr_lang);
            expect(clientRegistration.onContinueToEnroll).toHaveBeenCalled();
        });
        it('should not call on continue to enroll if the account number is in 2021 Long rain', () => {
            var {client}  = require('./test-client-with-loan');
            client.BalanceHistory[0].SeasonName = '2021, Long Rain';
            client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 0;
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            clientEnrollment.start(account, country,enr_lang);
            expect(clientRegistration.onContinueToEnroll).not.toBeCalled();
        });
        it('should call on continue to enroll if the account number has no balance history', () => {
            var {client}  = require('./test-client-with-loan');
            client.BalanceHistory=[];
            roster.getClient = jest.fn().mockImplementationOnce(() => {return client ;});
            clientEnrollment.start(account, country,enr_lang);
            expect(clientRegistration.onContinueToEnroll).toBeCalled();
        });
        
    });
});

