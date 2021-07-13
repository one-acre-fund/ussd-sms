const checkForGroupLeader = require('./checkForGroupLeader');

describe('check for group leader', () => {
    beforeAll(() => {
        service.vars.group_leaders_table = 'IDgroup_leaders_table';
    });
    var tableMock = {queryRows: jest.fn()};
    var cursorMock = {hasNext: jest.fn()};
    jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
    jest.spyOn(tableMock, 'queryRows').mockReturnValue(cursorMock);

    it('should return false if a client is not in group leaders table', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(false);
        const result = checkForGroupLeader('12345678');

        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {'account_number': '12345678'}});
        expect(result).toEqual(false);
    });
    it('should return true if a client is in group leaders table', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(true);
        const result = checkForGroupLeader('12345678');

        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {'account_number': '12345678'}});
        expect(result).toEqual(true);
    });
});
