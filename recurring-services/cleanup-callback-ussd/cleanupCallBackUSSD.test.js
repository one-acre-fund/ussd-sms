require('./cleanupCallBackUSSD');

describe('Cleanup CallBackUSSD', () => {
    it('should delete all records that match query', () => {
        global.service = {
            vars: {
                tableId: 'mockTableId',
                limit: 20,
            }
        };
        var count = 30;
        const row = {
            delete: jest.fn(),
        };
        row.delete.mockImplementation(() => {
            count--;
        });

        const cursor = {
            hasNext: jest.fn(),
            next: jest.fn(),
            limit: jest.fn(),
        };
        cursor.hasNext.mockImplementation(() => count > 0);
        cursor.next.mockReturnValue(row);

        const table = {
            queryRows: jest.fn(),
        };
        table.queryRows.mockReturnValue(cursor);

        project.initDataTableById.mockReturnValue(table);
        console.log = jest.fn();

        global.main();
        expect(count).toBe(0);
        expect(row.delete.mock.calls.length).toBe(30);
    });
});
