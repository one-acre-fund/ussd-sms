var checkCreditOfficer = require('./checkCreditOfficer');

describe('Check credit officer', () => {
    it('should return false once the user is not in the lookup table', () => {
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(() =>  false)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);

        var result = checkCreditOfficer('345bquwkeyr', 'test_clients_table');
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'officer_id': '345bquwkeyr'}});
        expect(result).toBeFalsy();
    });

    it('should return false once the user is not in the lookup table', () => {
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(() =>  true), next: jest.fn()};
        jest.spyOn(cursor, 'next').mockReturnValue({vars: {site_id: '3', district_id: '5'}});
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);

        var result = checkCreditOfficer('345bquwkeyr', 'test_clients_table');
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'officer_id': '345bquwkeyr'}});
        expect(result).toEqual({'district_id': '5', 'site_id': '3'});
    });
});