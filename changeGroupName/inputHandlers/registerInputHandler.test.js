const registerInputHandlers = require('./registerInputHandlers');
const groupNameInputHandler = require('./groupNameHandler');

jest.mock('./groupNameHandler');

describe('register input handler', () => {
    it('should register group name input handler', () => {
        var handler = jest.fn();
        jest.spyOn(groupNameInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers('en');
        expect(addInputHandler).toHaveBeenCalledWith('change_group_name_handler', handler);
        expect(groupNameInputHandler.getHandler).toHaveBeenCalledWith('en');
    });
});
