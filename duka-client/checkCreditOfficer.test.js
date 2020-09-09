var checkCreditOfficer = require('./checkCreditOfficer');

describe('Check credit officer', () => {
    it('should return false once the user is not in the lookup table', () => {
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(() =>  false)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);

        var result = checkCreditOfficer('345bquwkeyr', 'test_clients_table');
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'officer_id': '345bquwkeyr'}});
        expect(result).toBe(false);
    });

    it('should return false once the user is not in the lookup table', () => {
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(() =>  true)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);

        var result = checkCreditOfficer('345bquwkeyr', 'test_clients_table');
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'officer_id': '345bquwkeyr'}});
        expect(result).toBe(true);
    });
});