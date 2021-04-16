const changeGroupNameApi = require('../../shared/rosterApi/changeGroupNameApi');
const groupNameHandler = require('./groupNameHandler');

jest.mock('../../shared/rosterApi/changeGroupNameApi');

describe('group name handler', () => {
    beforeAll(() => {
        state.vars.client_changing_group = JSON.stringify({
            'DistrictId': 'D123',
            'GroupId': 'G123',
            'ClientId': 'C123',
        });
    });
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should reprompt if there is no/invalid group name', () => {
        const handler = groupNameHandler.getHandler('en');
        handler('');
        expect(sayText).toHaveBeenCalledWith('Enter Group Name');
        expect(promptDigits).toHaveBeenCalledWith(groupNameHandler.handlerName);
    });

    it('should change group successfully', () => {
        changeGroupNameApi.mockReturnValueOnce({GroupName: 'Itetero'});
        const handler = groupNameHandler.getHandler('en');
        handler('Itetero');
        expect(changeGroupNameApi).toHaveBeenCalledWith({'clientId': 'C123', 'districtId': 'D123', 'groupId': 'G123', 'groupName': 'Itetero'});
        expect(sayText).toHaveBeenCalledWith('Group changed to Itetero');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should notify the user if changing group fails', () => {
        changeGroupNameApi.mockReturnValueOnce();
        const handler = groupNameHandler.getHandler('en');
        handler('Itetero');
        expect(sayText).toHaveBeenCalledWith('Error changing group. Try again later');
        expect(stopRules).toHaveBeenCalled();
    });
});
