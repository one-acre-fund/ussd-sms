const {getHandler} = require('./on-select');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('getHandler', () => {
    let onTransactionSelected;
    var selectionHandler;
    beforeEach(() => {
        onTransactionSelected = jest.fn();
        selectionHandler = getHandler(onTransactionSelected);
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
    it('should call notifyELK',()=>{
        selectionHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
});