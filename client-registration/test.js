const confrmNationalIdHandler = require('./confirm-national-id-handler/confirmNationalIdHandler');
const confrmPhoneNumberHandler = require('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
const firstNameHandler = require('./first-name-handler/firstNameHandler');
const nationalIdHandler = require('./national-id-handler/nationalIdHandler');
const phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
const secondNameHandler = require('./second-name-handler/secondNameHandler');
const groupLeaderQuestionHandler = require('./group-leader-question-handler/groupLeaderQuestionHandler');
var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
var {client}  = require('../client-enrollment/test-client-data'); 
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('../Roster-endpoints/Fo-info/getFoInfo');
jest.mock('./confirm-national-id-handler/confirmNationalIdHandler');
jest.mock('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
jest.mock('./first-name-handler/firstNameHandler');
jest.mock('./national-id-handler/nationalIdHandler');
jest.mock('./phone-number-handler/phoneNumberHandler');
jest.mock('./second-name-handler/secondNameHandler');
jest.mock('./group-leader-question-handler/groupLeaderQuestionHandler');

const mockConfrmNationalIdHandler = jest.fn();
const mockConfrmPhoneNumberHandler = jest.fn();
const mockFirstNameHandler = jest.fn();
const mockNationalIdHandler = jest.fn();
const mockPhoneNumberHandler = jest.fn();
const mockSecondNameHandler = jest.fn();
const mockGroupLeaderQuestionHandler = jest.fn();
var mockTable = { createRow: jest.fn()};
var mockRow = {save: jest.fn()};

const clientRegistration = require('./clientRegistration');
const account = 123456789;
const country = 'KE';
const reg_lang = 'en-ke';
const nationalId = 12345678;
const phone = '0786182099';
var foPhone = '0786192039';
describe('clientRegistration', () => {

    it('should have a start function', () => {
        expect(clientRegistration.start).toBeInstanceOf(Function);
    });
    beforeEach(() => {
        confrmNationalIdHandler.getHandler.mockReturnValue(mockConfrmNationalIdHandler);
        confrmPhoneNumberHandler.getHandler.mockReturnValue(mockConfrmPhoneNumberHandler);
        firstNameHandler.getHandler.mockReturnValue(mockFirstNameHandler);
        nationalIdHandler.getHandler.mockReturnValue(mockNationalIdHandler);
        phoneNumberHandler.getHandler.mockReturnValue(mockPhoneNumberHandler);
        secondNameHandler.getHandler.mockReturnValue(mockSecondNameHandler);
        groupLeaderQuestionHandler.getHandler.mockReturnValue(mockGroupLeaderQuestionHandler);
        state.vars.reg_lang ='en-ke';
    });

    it('should add national Id Confirmation handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(confrmNationalIdHandler.handlerName, confrmNationalIdHandler.getHandler());            
    });
    it('should add phone number Confirmation handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(confrmPhoneNumberHandler.handlerName, confrmPhoneNumberHandler.getHandler());            
    });
    it('should add firstName handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(firstNameHandler.handlerName, firstNameHandler.getHandler());            
    });
    it('should add national Id handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(nationalIdHandler.handlerName, nationalIdHandler.getHandler());            
    });
    it('should add phone Number handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler());            
    });
    it('should add second Name handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(secondNameHandler.handlerName, secondNameHandler.getHandler());            
    });
    it('should add group leader question handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(groupLeaderQuestionHandler.handlerName, groupLeaderQuestionHandler.getHandler());            
    });
    describe('National Id Submission success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = nationalIdHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to confirm the national Id they have entered', () => {
            callback(nationalId);
            expect(sayText).toHaveBeenCalledWith(`You enter ${nationalId} ID`+
            '. Enter 1 to confirm or 2 to try again');
        });
        it('should prompt for the client to confirm their national Id', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(confrmNationalIdHandler.handlerName);
        });
    });
    describe('National Id confirmation success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = confrmNationalIdHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to enter their first name after they confirm their ID', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Please reply with the first name of the member you want to add to your group');
        });
        it('should prompt for the client for their first name', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(firstNameHandler.handlerName);
        });
    });
    describe('First name prompt success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = firstNameHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to enter their last name after they have entered their first name', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Please reply with the second name of the member you want to add to your group');
        });
        it('should prompt for the client for their last name', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(secondNameHandler.handlerName);
        });
    });
    describe('second name prompt success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = secondNameHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to enter their phone number after they have entered their last name', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Reply with the Phone number of the farmer');
        });
        it('should prompt for the client for phone number', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(phoneNumberHandler.handlerName);
        });
    });
    describe('phone number prompt success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = phoneNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to confirm their phone number after they have entered it', () => {
            callback(phone);
            expect(sayText).toHaveBeenCalledWith(`You enter ${phone}`+
            ' Phone number. Enter 1 to confirm or 2 to try again');
        });
        it('should prompt to ask the user if the would like to be a GL', () => {
            callback(phone);
            expect(promptDigits).toHaveBeenCalledWith(confrmPhoneNumberHandler.handlerName);
        });
    });
    describe('confirm phone number success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = confrmPhoneNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should ask the client if they are willing to become a group leader after they have entered their last name', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Does the farmer want to be a Group Leader of a new group?\n1) Yes\n2) No');
        });
        it('should prompt the client for the group leader interest question', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(groupLeaderQuestionHandler.handlerName);
        });
    });
    describe('group leader question success callback', () => {
        var callback;

        beforeAll(()=>{ 
            project.sendMessage = jest.fn(); 
            project.initDataTableById = jest.fn();
            mockTable.createRow.mockReturnValue(mockRow);
            project.initDataTableById.mockReturnValue(mockTable); 
            contact.phone_number = '0789098965';
            state.vars.phoneNumber = '0789777767';
            getFOInfo.mockImplementation(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': foPhone};});
        });
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = groupLeaderQuestionHandler.getHandler.mock.calls[0][0];
            JSON.parse = jest.fn().mockImplementation(() => {return client ;});
        });
        it('should send a message containing the FO phone number to the Group leader phone number if the FO contact is available', () => {
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is ${client.AccountNumber}`+
                `. Please visit the FO to add inputs or call the FO on ${foPhone}`, 
                to_number: contact.phone_number
            }));
        });
        it('should send a message containing the FO phone number to the new client phone number if the FO contact is available', () => {  
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is ${client.AccountNumber}`+
                `. Please visit the FO to add inputs or call the FO on ${foPhone}`, 
                to_number: state.vars.phoneNumber
            }));
        });
        it('should show a message containing the FO phone number if the FO contact is available', () => {  
            callback();
            expect(sayText).toHaveBeenCalledWith(`Thank you for expressing your interest to enroll with OAF. Your Account Number is ${client.AccountNumber}`+
                `. Please visit the FO to add inputs or call the FO on ${foPhone}`);
        });
        it('should send a message with no FO phone number to the GL phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': null};});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: contact.phone_number
            }));
        });
        it('should save a row in the datatables with clients information if registration is successful', () => {  
            state.vars.groupLeader = 1; 
            callback();
            expect(mockTable.createRow).toHaveBeenCalledWith({
                'contact_id': contact.id,
                'from_number': contact.from_number,
                'vars': {
                    'account_number': client.AccountNumber,
                    'national_id': client.NationalId,
                    'phone_number': state.vars.phoneNumber,
                    'first_name': client.FirstName,
                    'last_name': client.LastName,
                    'district': client.DistrictId,
                    'site': client.SiteId,
                    'new_client': '1',
                    'gl_interested': state.vars.groupLeader
                }
            });
            expect(mockRow.save).toHaveBeenCalled();
        });
        it('should send a message with no FO phone number to the new client phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': null};});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: state.vars.phoneNumber
            }));
        });
        
        it('should send a message with no FO phone number to the GL phone number if the FO contact is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return null;});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: contact.phone_number
            }));
        });
        it('should send a message with no FO phone number to the new client phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return null;});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: state.vars.phoneNumber
            }));
        });
        it('should show a message with no FO phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return null;});
            callback();
            expect(sayText).toHaveBeenCalledWith(`Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.');
        });
    });

    describe('start', () => {
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.reg_lang = '';
            clientRegistration.start(account, country,reg_lang);
            expect(state.vars).toMatchObject({account,country,reg_lang});
        });
        it('should call notifyELK', () => {
            clientRegistration.start(account, country,reg_lang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should show a what is the farmer\'s national Id message', () => {
            clientRegistration.start(account, country, reg_lang);
            expect(sayText).toHaveBeenCalledWith('What is their national ID?');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should prompt for the farmer\'s national Id', () => {
            clientRegistration.start(account, country, reg_lang);
            expect(promptDigits).toHaveBeenCalledWith(nationalIdHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
    });
});