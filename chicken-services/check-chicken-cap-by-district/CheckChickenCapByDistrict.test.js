var checkChickenCapByDistrict = require('./CheckChickenCapByDistrict');
const {client}  = require('../test-client-data');
const mockCursor = { 
    next: jest.fn(), 
    hasNext: jest.fn()
};
const mockTable = { queryRows: jest.fn() };
var mockRow ={vars: { ordered_chickens: 10, confirmed: 1, district: client.DistrictName, sector: 'Muganza'}};
var fakeMockRow ={vars: { ordered_chickens: 10, confirmed: 1, district: client.DistrictName, sector: 'NoSector'}};
var mockClientRow = {vars: {account_number: client.AccountNumber, district: client.DistrictName, sector: 'Muganza'}};

describe('change_order_handler', () => {
    beforeAll(()=>{
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
    });

    it('should be  function',()=>{
        expect(checkChickenCapByDistrict).toBeInstanceOf(Function);
    });
    it('should return false if the number of caps in a district is equal to the number of chicken ordered', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockRow.vars.ordered_chickens = 10000;
        mockCursor.next.mockReturnValueOnce(mockClientRow).mockReturnValueOnce(mockRow);
        var result = checkChickenCapByDistrict(client);
        expect(result).toBeFalsy();
    });
    it('should return false if the number of caps in a district is 1 less to the number of chicken ordered', ()=>{
        mockRow.vars.ordered_chickens = 9999;
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockClientRow).mockReturnValueOnce(mockRow);
        var result = checkChickenCapByDistrict(client);
        expect(result).toBeFalsy();
    });
    it('should return the number of possible chicken if the  number of caps in a district is less to the number of chicken ordered', ()=>{
        mockRow.vars.ordered_chickens = 6;
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockClientRow).mockReturnValueOnce(mockRow);
        var result = checkChickenCapByDistrict(client);
        expect(result).toEqual(432);
    });
    it('should return false if no caps were found', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        var result = checkChickenCapByDistrict(client);
        expect(result).toBeFalsy();
    });
    it('should return false if no caps were found', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(fakeMockRow);
        var result = checkChickenCapByDistrict(client);
        expect(result).toBeFalsy();
    });
});