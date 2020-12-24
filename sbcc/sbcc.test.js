const notifyELK = require('../notifications/elk-notification/elkNotification');
const sbcc = require('./sbcc');

jest.mock('../notifications/elk-notification/elkNotification');
describe('SBCC', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should register input handlers', () => {
        var sbccMenuHandler = require('./input-handlers/sbccMenuHandler');
        var nationalIdHandler = require('./input-handlers/nationalIdHandler');
        var pinHandler = require('./input-handlers/pinHandler');
        var pinMenuHandler = require('./input-handlers/pinMenuHandler');
        var sbcchandler = jest.fn();
        jest.spyOn(sbccMenuHandler, 'getHandler').mockReturnValueOnce(sbcchandler);
        sbcc.registerInputHandlers({lang: 'en', backMenu: jest.fn()});

        expect(addInputHandler).toHaveBeenCalledTimes(4);
        expect(addInputHandler).toHaveBeenCalledWith('sbcc_menu', sbcchandler);
        expect(addInputHandler).toHaveBeenCalledWith('national_id', nationalIdHandler);
        expect(addInputHandler).toHaveBeenCalledWith('pin_menu', pinMenuHandler);
        expect(addInputHandler).toHaveBeenCalledWith('pin', pinHandler);
    });

    it('should start the sbcc process', () => {
        sbcc.startSBCC({lang: 'en'});
        expect(sayText).toHaveBeenCalledWith('Enter your national ID number\n1) Enter my ID number\n2) I forgot my National ID number\n3) Back');
        expect(promptDigits).toHaveBeenCalledWith('sbcc_menu', {submitOnHash: true, maxDigits: 2, timeout: 5});
    });

    it('should call notifyELK',()=>{
        sbcc.startSBCC({lang: 'en'});
        expect(notifyELK).toHaveBeenCalled();
    });
});