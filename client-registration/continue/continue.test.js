const {getHandler} = require('./continue');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('continueHandler', () => {
    let onContinueToEnroll;
    var continueHandler;
    beforeEach(() => {
        onContinueToEnroll = jest.fn();
        continueHandler = getHandler(onContinueToEnroll);
    });
    it('should return a function', () => {
        expect(getHandler(onContinueToEnroll)).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        continueHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onContinueToEnroll if the user press 1', () => {
        continueHandler(1);
        expect(onContinueToEnroll).toHaveBeenCalled();
    });
    it('should not call onContinueToEnroll if the user doesn\'t press 1', () => {
        continueHandler(2);
        expect(onContinueToEnroll).not.toBeCalled();
    });
});