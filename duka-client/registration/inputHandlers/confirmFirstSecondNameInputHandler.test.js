const confirmFirstSecondNameInputHandler = require('./confirmFirstSecondNameInputHandler');
// var nationalIdInputHandler = require('./nationalIdInputHandler');
const firstNameInputHandler = require('./firstNameInputHandler');
// const phoneNumberInputHandler = require('./phoneNumberInputHandler');
const registerClient = require('../../../shared/rosterApi/registerClient');
var logger = require('../../../logger/elk/elk-logger');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../shared/rosterApi/registerClient');
jest.mock('../../../logger/elk/elk-logger');
jest.mock('../../../notifications/elk-notification/elkNotification');

describe.each(['en-ke', 'sw'])('confirm first and second name using (%s)', (lang) => {
    beforeEach(() => {
        state.vars.credit_officer_details = JSON.stringify({district_id: '5', site_id: '6'});
    });

    afterEach(() => {
        state.vars = {};
    });

    it('should call the elk', () => {
        const confirmHandler = confirmFirstSecondNameInputHandler.getHandler(lang);
        confirmHandler(2);
        expect(notifyElk).toHaveBeenCalled();
    });

    it('should prompt for first name once the user chooses 2 --' + lang, () => {
        const confirmHandler = confirmFirstSecondNameInputHandler.getHandler(lang);
        confirmHandler(2);
        const message = {
            'en-ke': 'Please reply with the first name of the client.',
            'sw': 'Tafadhali jibu na jina la kwanza la mteja.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(firstNameInputHandler.handlerName);
    });

    it('should prompt for reprompt the user for the confirmation once the user chooses an invalid choice --' + lang, () => {
        const confirmHandler = confirmFirstSecondNameInputHandler.getHandler(lang);
        state.vars.duka_client_first_name = 'Jamie';
        state.vars.duka_client_second_name = 'Fox';
        confirmHandler('000');
        const message = {
            'en-ke': 'Enroll client Jamie Fox\n' +
            '1) To confirm\n' +
            '2) To try again.',
            'sw': 'Sajili mteja Jamie Fox\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(confirmFirstSecondNameInputHandler.handlerName);
    });

    it('should register the client and save their data into a dataTable once the user chooses 1 --' + lang, () => {
        const confirmHandler = confirmFirstSecondNameInputHandler.getHandler(lang, 'duka_clients_table');
        state.vars.duka_client_first_name = 'Jamie';
        state.vars.duka_client_second_name = 'Fox';
        state.vars.duka_client_nid = '12345678';
        state.vars.duka_client_phone_number = '0788765453';
        state.vars.duka_client_invoice_id = 'axdf87';
        contact.phone_number = '0788334455';
        registerClient.mockReturnValueOnce({AccountNumber: '12324565'});
        const rowMock = {save: jest.fn()};
        const tableMock = {createRow: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValue(rowMock);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(tableMock);
        confirmHandler(1);
        const message = {
            'en-ke': 'Thank you for registering with OAF. Your Account Number is 12324565. The Duka team will help you complete your loan.',
            'sw': 'Asante kwa kusajili na OAF. Nambari yako ya Akaunti ni 12324565. Timu ya Duka itakusaidia kumaliza mkopo wako'
        };
        expect(project.scheduleMessage).toHaveBeenCalledWith({
            content: message[lang], 
            to_number: '0788334455',
            start_time_offset: 0
        });
        expect(project.scheduleMessage).toHaveBeenCalledWith({
            content: message[lang], 
            to_number: '0788765453',
            start_time_offset: 15
        });
        expect(tableMock.createRow).toHaveBeenCalledWith({'vars': {'account_number': '12324565', 'invoice_id': 'axdf87', 'phone_number': '0788765453'}});
    });

    it('should send an error once the registration fails --' + lang, () => {
        const confirmHandler = confirmFirstSecondNameInputHandler.getHandler(lang, 'duka_clients_table');
        state.vars.duka_client_first_name = 'Jamie';
        state.vars.duka_client_second_name = 'Fox';
        state.vars.duka_client_nid = '12345678';
        state.vars.duka_client_phone_number = '0788765453';
        state.vars.duka_client_invoice_id = 'axdf87';
        const message = {
            'en-ke': 'Error while registering client. please try again later',
            'sw': 'Hitilafu wakati wa kusajili mteja. tafadhali jaribu tena baadae'
        };
        const mockLogger = {
            error: jest.fn(),
        };
        logger.mockReturnValue(mockLogger);

        registerClient.mockReturnValueOnce(null);
        const rowMock = {save: jest.fn()};
        const tableMock = {createRow: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValue(rowMock);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(tableMock);
        confirmHandler(1);
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(mockLogger.error).toHaveBeenCalledWith('Unable to register a duka client');
    });

    it('should show n account number once the user is already registered --' + lang, () => {
        const confirmHandler = confirmFirstSecondNameInputHandler.getHandler(lang, 'duka_clients_table');
        state.vars.duka_client_first_name = 'Jamie';
        state.vars.duka_client_second_name = 'Fox';
        state.vars.duka_client_nid = '12345678';
        state.vars.duka_client_phone_number = '0788765453';
        state.vars.duka_client_invoice_id = 'axdf87';
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '9876523'});
        const messages = {
            'en-ke': 'Client is already enrolled. account number: 9876523',
            'sw': 'Mteja amesajiliwa tayari. nambari ya akaunti: 9876523'
        };
        registerClient.mockReturnValueOnce(null);
        confirmHandler(1);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
    });
});
