const {getHandler} = require('./on-select');

describe('getHandler', () => {
    let onTransactionSelected;
    beforeEach(() => {
        onTransactionSelected = jest.fn();
    });

    it('should return a function', () => {
        expect(getHandler(onTransactionSelected)).toBeInstanceOf(Function);
    });
    
    it('should call the ontransactionSelected callback when the returned value is called', () => {
        const handler  = getHandler(onTransactionSelected);
        const mockInput = 'foo';
        expect(onTransactionSelected).not.toHaveBeenCalledWith(mockInput);
        handler(mockInput);
        expect(onTransactionSelected).toHaveBeenCalledWith(mockInput);
    });
});