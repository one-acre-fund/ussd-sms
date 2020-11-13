var validateGroup = require('./validateGroup');
const validGroup = '33646*005*00255';
const invalidGroup = '111111111111';
const mockCursor = {
    hasNext: jest.fn()
};
const mockTable = { queryRows: jest.fn() };
describe('validate_group', () => {

    beforeAll(()=>{
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
    });
  
    it('should be  function',()=>{
        expect(validateGroup).toBeInstanceOf(Function);
    });
    it('should return true if the groupcode is found', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var isValid = validateGroup(validGroup);
        expect(isValid).toBeTruthy();
    });
    it('should return false if the groupcode is not found', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        var isValid = validateGroup(invalidGroup);
        expect(isValid).toBeFalsy();
    });

});