var getShsPrice = require('./getShsPrice');

var tableMock = {queryRows: jest.fn()};
var cursorMock = {hasNext: jest.fn(), next: jest.fn()};

describe('shs price', () => {
    beforeAll(() => {
        service.vars.shsPricesTableId = 'XXX-shsPricesTableId-XXX';
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(cursorMock);
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
    });


    it('Should return the shs price once it exists', () => {
        var mockRow = {vars: {shs_price: 40000}};
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursorMock, 'next').mockReturnValueOnce(mockRow);
        var result = getShsPrice('22A');
        expect(result).toEqual(40000);
    });

    it('Should return 20000 if there is no record for the specific credit cycle', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(false);
        var result = getShsPrice('22A');
        expect(result).toEqual(20000);
    });
});