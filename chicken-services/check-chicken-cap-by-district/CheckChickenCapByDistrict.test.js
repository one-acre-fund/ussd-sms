var checkChickenCapByDistrict = require('./CheckChickenCapByDistrict');

const mockCursor = { 
    next: jest.fn(), 
    hasNext: jest.fn()
};
const mockTable = { queryRows: jest.fn() };
var mockRow ={vars: { ordered_chickens: 10, confirmed: 1}};

describe('change_order_handler', () => {
    beforeAll(()=>{
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
    });

    it('should be  function',()=>{
        expect(checkChickenCapByDistrict).toBeInstanceOf(Function);
    });
    it('should return false if the number of caps in a district is equal to the number of chicken ordered', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow);
        var result = checkChickenCapByDistrict(5646,8);
        expect(result).toBeFalsy();
    });
    it('should return false if the number of caps in a district is 1 less to the number of chicken ordered', ()=>{
        mockRow.vars.ordered_chickens = 9;
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow);
        var result = checkChickenCapByDistrict(5646,8);
        expect(result).toBeFalsy();
    });
    it('should return the number of possible chicken if the  number of caps in a district is less to the number of chicken ordered', ()=>{
        mockRow.vars.ordered_chickens = 6;
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow);
        var result = checkChickenCapByDistrict(5646,8);
        expect(result).toEqual(4);
    });
    it('should return false if no caps were found', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        var result = checkChickenCapByDistrict(5646,7);
        expect(result).toBeFalsy();
    });
});