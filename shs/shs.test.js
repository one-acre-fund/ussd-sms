const shs = require('./shs');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var shsMenuHandler = require('./shs-menu-handler/shsMenuHandler');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var gLMenuHandler = require('./gL-menu-handler/gLMenuHandler');
var shsTypeHandler = require('./shs-type-handler/shsTypeHandler');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');
var getCodeSerialHandler = require('./get-code-serial-handler/getCodeSerialHandler');
var registrationTypeHandler = require('./registration-type-handler/registrationTypeHandler');
const {client}  = require('../client-enrollment/test-client-data'); 


jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./shs-menu-handler/shsMenuHandler');
jest.mock('./serial-number-handler/serialNumberHandler');
jest.mock('./gL-menu-handler/gLMenuHandler');
jest.mock('./shs-type-handler/shsTypeHandler');
jest.mock('./account-number-handler/accountNumberHandler');
jest.mock('./get-code-serial-handler/getCodeSerialHandler');
jest.mock('./registration-type-handler/registrationTypeHandler');


const mockserialNumberHandler = jest.fn();
const mockgetCodeSerialHandler = jest.fn();

var country = 'KE';
var shsLang = 'en';
var isGroupLeader = '';
var callback;

var serialNumbers = [
    {
        'unitType': 'biolite',
        'unitSerialNumber': '23456789',
        'keyCode': '123 456 789',
        'keyCodeType': 'ACTIVATION'
    },
    {
        'unitType': 'sunking',
        'unitSerialNumber': '23456789',
        'keyCode': '123 466 799',
        'keyCodeType': 'UNLOCK'
    }
];

describe('shs', () => {
    it('should have a start function', () => {
        expect(shs.start).toBeInstanceOf(Function);
    });
    it('should add the serialNumberHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(serialNumberHandler.handlerName, serialNumberHandler.getHandler(mockserialNumberHandler));            
    });
    it('should add the shsMenuHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(shsMenuHandler.handlerName, shsMenuHandler.getHandler());            
    });
    it('should add the gLMenuHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(gLMenuHandler.handlerName, gLMenuHandler.getHandler());            
    });
    it('should add the shsTypeHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(shsTypeHandler.handlerName, shsTypeHandler.getHandler());            
    });
    it('should add the accountNumberHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(accountNumberHandler.handlerName, accountNumberHandler.getHandler());            
    });
    it('should add the getCodeSerialHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(getCodeSerialHandler.handlerName, getCodeSerialHandler.getHandler(mockgetCodeSerialHandler));            
    });
    it('should add the registrationTypeHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(registrationTypeHandler.handlerName, registrationTypeHandler.getHandler());            
    });


    describe('start', ()=>{
        var account = client.AccountNumber;
        it('should set the state variables',()=>{
            state.vars.account = '';
            state.vars.country = '';
            state.vars.isGroupLeader = '';
            state.vars.shsLang = '';
            shs.start(JSON.stringify(client), country, shsLang,isGroupLeader);
            expect(state.vars).toMatchObject({account,country,isGroupLeader,shsLang});
        });
        it('should call notify ELK',()=>{
            shs.start(JSON.stringify(client), country, shsLang,isGroupLeader);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should display the shs menu and prompt for input if the user is not a group leader',()=>{
            shs.start(account, country, shsLang,isGroupLeader);
            expect(sayText).toHaveBeenCalledWith('What do you want to do?\n1)Register New SHS Unit \n2)Get Activation/ Unlock Code\n3)View Recent Activation/Unlock Code \n4)Back');
            expect(promptDigits).toHaveBeenCalledWith(shsMenuHandler.handlerName);
        });
        it('should display the GL shs menu and prompt for input if the user is a group leader',()=>{
            isGroupLeader = true;
            shs.start(account, country, shsLang,isGroupLeader);
            expect(sayText).toHaveBeenCalledWith('Select a Service\n1) My SHS Unit\n2)SHS Unit for another Client\n3) Back');
            expect(promptDigits).toHaveBeenCalledWith(gLMenuHandler.handlerName);
        });

    });

    describe('serialNumberHandler handler successful callback', ()=>{ 
        beforeEach(() => {
            shs.registerHandlers();
            callback = serialNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should send the user\'s activation code if he is the one using the phone',()=>{
            callback(serialNumbers[0]);
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Your activation code is ${serialNumbers[0].keyCode}`,
                to_number: contact.phonenumber}));
            expect(stopRules).toHaveBeenCalled();
        });
        it('should display the user\'s unlock code if he is the one using the phone',()=>{
            callback(serialNumbers[1]);
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Your unlock code is ${serialNumbers[1].keyCode}`,
                to_number: contact.phonenumber}));
            expect(stopRules).toHaveBeenCalled();
        });
        it('should send the farmer\'s activation code if he is not the one using the phone',()=>{
            state.vars.unitForOther = 'true';
            callback(serialNumbers[0]);
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `The Client's activation code is ${serialNumbers[0].keyCode}`,
                to_number: contact.phonenumber}));
            expect(stopRules).toHaveBeenCalled();
        });
        it('should send the farmer\'s unlock code if he is not the one using the phone',()=>{
            state.vars.unitForOther = 'true';
            callback(serialNumbers[1]);
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `The Client's unlock code is ${serialNumbers[1].keyCode}`,
                to_number: contact.phonenumber}));
            expect(stopRules).toHaveBeenCalled();
        });
        it('should display the farmer\'s unlock code if he is not the one using the phone and its a code request',()=>{
            state.vars.unitForOther = 'true';
            callback(serialNumbers[1],true);
            expect(sayText).toHaveBeenCalledWith(`The Client's unlock code is ${serialNumbers[1].keyCode}`);
            expect(stopRules).toHaveBeenCalled();
        });
    });
});
    