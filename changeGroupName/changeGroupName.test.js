const changeGroupName = require('./changeGroupName');
const groupNameHandler = require('./inputHandlers/groupNameHandler');

describe('change group name', () => {
    it('should prompt for group name', () => {
        changeGroupName.start('en', JSON.stringify({AccountNumber: '1234'}));
        expect(sayText).toHaveBeenCalledWith('Enter Group Name');
        expect(promptDigits).toHaveBeenCalledWith(groupNameHandler.handlerName);
        expect(state.vars.client_changing_group).toEqual('{"AccountNumber":"1234"}');
    });
    it('should export a start and registerInputHandlers functions', () => {
        expect(changeGroupName.start).toBeInstanceOf(Function);
        expect(changeGroupName.registerInputHandlers).toBeInstanceOf(Function);
    });
});
