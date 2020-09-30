const {getHandler} = require('./firstNameHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('firstNameHandler', () => {
    let onFirstNameReceived;
    var firstNameHandler;
    beforeEach(() => {
        onFirstNameReceived = jest.fn();
        firstNameHandler = getHandler(onFirstNameReceived);
    });
    it('should return a function', () => {
        expect(getHandler(onFirstNameReceived)).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        firstNameHandler('hello');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should remove special characters from the name', () => {
        const handler  = getHandler(onFirstNameReceived);
        const mockInput = 'hellO1 \' `*1& ^_ ';
        handler(mockInput);
        expect(onFirstNameReceived).toHaveBeenCalledWith('hellO');
    });
    it('should call the onFirstNameReceived callback when the returned value is called', () => {
        const handler  = getHandler(onFirstNameReceived);
        const mockInput = 'hello';
        expect(onFirstNameReceived).not.toHaveBeenCalledWith(mockInput);
        handler(mockInput);
        expect(onFirstNameReceived).toHaveBeenCalledWith(mockInput);
    });
});