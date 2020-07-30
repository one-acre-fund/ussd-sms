const {getHandler} = require('./firstNameHandler');

describe('firstNameHandler', () => {
    let onFirstNameReceived;
    beforeEach(() => {
        onFirstNameReceived = jest.fn();
    });

    it('should return a function', () => {
        expect(getHandler(onFirstNameReceived)).toBeInstanceOf(Function);
    });
    
    it('should call the onFirstNameReceived callback when the returned value is called', () => {
        const handler  = getHandler(onFirstNameReceived);
        const mockInput = 'hello';
        expect(onFirstNameReceived).not.toHaveBeenCalledWith(mockInput);
        handler(mockInput);
        expect(onFirstNameReceived).toHaveBeenCalledWith(mockInput);
    });
});