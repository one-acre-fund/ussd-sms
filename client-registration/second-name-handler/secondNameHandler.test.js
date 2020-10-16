const {getHandler} = require('./secondNameHandler');

const defaultSecondName = 'XXXXXXX';

describe('secondNameHandler', () => {
    let onSecondNameReceived;
    beforeEach(() => {
        onSecondNameReceived = jest.fn();
    });

    it('should return a function', () => {
        expect(getHandler(onSecondNameReceived)).toBeInstanceOf(Function);
    });
    it('should remove special characters from the name', () => {
        const handler  = getHandler(onSecondNameReceived);
        const mockInput = 'hellO1 \' `*1& ^_ ';
        handler(mockInput);
        expect(onSecondNameReceived).toHaveBeenCalledWith('hellO11');
    });
    it('should revert to default for empty name in RW', () => {
        state.vars.country = 'RW';
        const handler  = getHandler(onSecondNameReceived);
        const mockInput = '';
        handler(mockInput);
        expect(onSecondNameReceived).toHaveBeenCalledWith(defaultSecondName);
    });
    it('should revert to default for only special character names in RW', () => {
        state.vars.country = 'RW';
        const handler  = getHandler(onSecondNameReceived);
        const mockInput = '\' `*& ^_ ';
        handler(mockInput);
        expect(onSecondNameReceived).toHaveBeenCalledWith(defaultSecondName);
    });
    it('should remove special characters from the name in RW', () => {
        state.vars.country = 'RW';
        const handler  = getHandler(onSecondNameReceived);
        const mockInput = 'hellO1 \' `*1& ^_ ';
        handler(mockInput);
        expect(onSecondNameReceived).toHaveBeenCalledWith('hellO11');
    });
    it('should call the onSecondNameReceived callback when the returned value is called', () => {
        const handler  = getHandler(onSecondNameReceived);
        const mockInput = 'hello';
        expect(onSecondNameReceived).not.toHaveBeenCalledWith(mockInput);
        handler(mockInput);
        expect(onSecondNameReceived).toHaveBeenCalledWith(mockInput);
    });
});
