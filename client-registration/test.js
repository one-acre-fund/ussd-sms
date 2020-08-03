const confrmNationalIdHandler = require('./confirm-national-id-handler/confirmNationalIdHandler');
const confrmPhoneNumberHandler = require('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
const firstNameHandler = require('./first-name-handler/firstNameHandler');
const nationalIdHandler = require('./national-id-handler/nationalIdHandler');
const phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
const secondNameHandler = require('./second-name-handler/secondNameHandler');

jest.mock('./confirm-national-id-handler/confirmNationalIdHandler');
jest.mock('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
jest.mock('./first-name-handler/firstNameHandler');
jest.mock('./national-id-handler/nationalIdHandler');
jest.mock('./phone-number-handler/phoneNumberHandler');
jest.mock('./second-name-handler/secondNameHandler');


const mockConfrmNationalIdHandler = jest.fn();
const mockConfrmPhoneNumberHandler = jest.fn();
const mockFirstNameHandler = jest.fn();
const mockNationalIdHandler = jest.fn();
const mockPhoneNumberHandler = jest.fn();
const mockSecondNameHandler = jest.fn();

const clientRegistration = require('./clientRegistration');
const account = 123456789;
const country = 'KE';
const reg_lang = 'en-ke';
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


    describe('start', () => {
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.reg_lang = '';
            clientRegistration.start(account, country,reg_lang);
            expect(state.vars).toMatchObject({account,country,reg_lang});
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