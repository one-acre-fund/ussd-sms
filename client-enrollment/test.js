const clientEnrollment = require('./clientEnrollment');
const roster = require('../rw-legacy/lib/roster/api');
var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');

jest.mock('../rw-legacy/lib/roster/api');
jest.mock('../Roster-endpoints/Fo-info/getFoInfo');

const account = 123456789;
const country = 'KE';
const enr_lang = 'en';
const foPhone = '0786182098';
var mockTable = { createRow: jest.fn()};
var mockRow = {save:jest.fn()};
describe('clientRegistration', () => {
    beforeAll(()=>{
        roster.getClient = jest.fn();
        roster.authClient = jest.fn();
        project.sendMessage = jest.fn();
        project.initDataTableById = jest.fn();
        mockTable.createRow.mockReturnValue(mockRow);
        project.initDataTableById.mockReturnValue(mockTable);
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
            state.vars.enr_lang = '';
            clientEnrollment.start(account, country,enr_lang);
            expect(state.vars).toMatchObject({account,country,enr_lang});
        });
        it('should call roster.authClient', () => {
            clientEnrollment.start(account, country, enr_lang);
            expect(roster.authClient).toHaveBeenCalledTimes(1);
        });

        it('should call roster.getClinet if roster.authClient returns true', () => {
            clientEnrollment.start(account, country, enr_lang);
            expect(roster.getClient).toHaveBeenCalledTimes(1);
        });
        it('should send a message if loan is fully paid',()=>{
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
        
    });
});

