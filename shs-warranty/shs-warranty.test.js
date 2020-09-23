const shsWarranty = require('./shs-warranty');
const SerialNumberHandler    = require('./input-handlers/serial-number');

jest.mock('./input-handlers/serial-number');


describe('shsWarrantty', () => {
    it('should have a registerhandlers function', () => {
        expect(shsWarranty.registerHandlers).toBeInstanceOf(Function);
    });
    it('should have a start function', () => {
        expect(shsWarranty.start).toBeInstanceOf(Function);
    });
    describe('registerHandlers', () => {
        it('should register a serialNumberHandler', () => {
            const server = 'https://example.com';
            const mockHandler = jest.fn();
            SerialNumberHandler.getHandler.mockReturnValue(mockHandler);
            shsWarranty.registerHandlers(server);
            expect(SerialNumberHandler.getHandler).toHaveBeenCalledWith(server);
            expect(addInputHandler).toHaveBeenCalledWith(SerialNumberHandler.name, mockHandler);
        });
    });
    describe.each(['en-ke','sw'])('shsWarranty.start in (%s)',(lang) => {
        const serialNumberPromptMessage ={
            'en-ke': 'Enter the Serial number of your ProductEnter the Serial number of your Product',
            sw: 'Weka Serial number ya Bidhaa yako'
        };
        const gcid = 'some-user-global-client-id';
        beforeEach(() => {
            shsWarranty.start(lang, gcid);            
        });
        it('should set the globalCLientID in state variables', () => {
            expect(global.state.vars.GlobalClientId).toEqual(gcid);
        });
        it('should show the serial number prompt message in '+lang, () => {
            expect(sayText).toHaveBeenCalledWith(serialNumberPromptMessage[lang]);               
        });
        it('should prompt for the serial number to be input', () => {
            expect(promptDigits).toHaveBeenCalledWith(SerialNumberHandler.name);
        });
    });
});
