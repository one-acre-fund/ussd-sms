const {getHandler} = require('./secondNameHandler');

describe('secondNameHandler', () => {
    let onSecondNameReceived;
    beforeEach(() => {
        onSecondNameReceived = jest.fn();
    });

    it('should return a function', () => {
        expect(getHandler(onSecondNameReceived)).toBeInstanceOf(Function);
    });
    
    it('should call the onFirstNameReceived callback when the returned value is called', () => {
        const handler  = getHandler(onSecondNameReceived);
        const mockInput = 'hello';
        expect(onSecondNameReceived).not.toHaveBeenCalledWith(mockInput);
        handler(mockInput);
        expect(onSecondNameReceived).toHaveBeenCalledWith(mockInput);
    });
});