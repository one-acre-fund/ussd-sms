var callBackTimeCheck = require('./callBackTimeCheck');
var moment = require('moment');

describe('call back time check', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should return false if the time since ticket is created is greater than hours passed', () => {
        const mockTable = {queryRows: jest.fn()};
        const Mockcursor = {limit: jest.fn(), hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(mockTable, 'queryRows').mockReturnValueOnce(Mockcursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockTable);

        jest.spyOn(Mockcursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(Mockcursor, 'next').mockReturnValueOnce({time_created: 60});
        const response = callBackTimeCheck(12345, 'call', 50);
        expect(response).toEqual(false);
    });

    it('should return true if the time since ticket is created is less than hours passed', () => {
        const mockTable = {queryRows: jest.fn()};
        const Mockcursor = {limit: jest.fn(), hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(mockTable, 'queryRows').mockReturnValueOnce(Mockcursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockTable);

        jest.spyOn(Mockcursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(Mockcursor, 'next').mockReturnValueOnce({time_created: moment().format('X') * 2});
        const response = callBackTimeCheck(12345, 'call', 50);
        expect(response).toEqual(true);
    });

    it('should return false if the CallBackUSSD has no entry', () => {
        const mockTable = {queryRows: jest.fn()};
        const Mockcursor = {limit: jest.fn(), hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(mockTable, 'queryRows').mockReturnValueOnce(Mockcursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockTable);

        jest.spyOn(Mockcursor, 'hasNext').mockReturnValueOnce(false);
        jest.spyOn(Mockcursor, 'next').mockReturnValueOnce({time_created: moment().format('X') * 2});
        const response = callBackTimeCheck(12345, 'call', 50);
        expect(response).toEqual(false);
    });

    it('should call the create table and queryRows with the correct parameters', () => {
        const mockTable = {queryRows: jest.fn()};
        const Mockcursor = {limit: jest.fn(), hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(mockTable, 'queryRows').mockReturnValueOnce(Mockcursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockTable);

        jest.spyOn(Mockcursor, 'hasNext').mockReturnValueOnce(false);
        var accountNumber = 123;
        var type = 'call';
        var hours = 50;
        callBackTimeCheck(accountNumber, type, hours);
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('CallBackUSSD');
        expect(mockTable.queryRows).toHaveBeenCalledWith({
            vars: {'account_number': accountNumber, 'call_category': type}
        });
    });
});
