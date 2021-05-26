const getCapsBySector = require('./getCapsBySector');

describe('gte caps by sector', () => {
    const mockCursor = {hasNext: jest.fn(), next: jest.fn()};
    const mockTable = {queryRows: jest.fn()};
    beforeAll(()=>{
        project.getOrCreateDataTable.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call the table with the right details', () => {
        jest.spyOn(mockCursor, 'hasNext').mockReturnValueOnce(false);
        getCapsBySector('Nyanza', 'Kinazi');
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('chicken district_sector cap');
        expect(mockTable.queryRows).toHaveBeenCalledWith( {'vars': {'district_name': 'Nyanza', 'sector_name': 'Kinazi'}});
    });

    it('should return a null if there is no match from the caps table', () => {
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(mockTable);
        jest.spyOn(mockTable, 'queryRows').mockReturnValueOnce(mockCursor);
        jest.spyOn(mockCursor, 'hasNext').mockReturnValueOnce(false);
        var capDetails = getCapsBySector('Nyanza', 'Kinazi');
        expect(capDetails).toBeNull();
    });
});