
const avocadoEligibility = require('./avocadoEligibility');
const {client}  = require('../test-client-data');

describe('avocado_Eligibility', () => {

    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockTable = { queryRows: jest.fn() };
    mockTable.queryRows.mockReturnValue(mockCursor);
    var mockRow ={vars: { a_avokaqty: 4, prepay: 128000}};
    client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 5000;
    beforeEach(() => {
        sayText.mockClear();
        promptDigits.mockClear();
        
    });

    it('should return false if the client is not found in the table', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        var result = avocadoEligibility(mockTable,client.AccountNumber,client);
        expect(result).toBeFalsy();
    });
    it('should return the correct number of possible trees if the client ordered 0 trees(prepayment/500)', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 5000;
        mockRow ={vars: { a_avokaqty: 0, prepay: 1000}};
        var balances = client.BalanceHistory.TotalRepayment_IncludingOverpayments - mockRow.vars.prepay;
        var trees = balances / 500;
        mockCursor.next.mockReturnValueOnce(mockRow);
        var result = avocadoEligibility(mockTable,client.AccountNumber,client);
        expect(result).toEqual(({
            possibleTrees: trees,
            balance: balances,
            orderedAvocado: mockRow.vars.a_avokaqty
        }));
    });
    it('should return the correct number of possible trees if the client ordered between 1-10 trees((prepayment_amount - 1000) / 500)', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 5000;
        mockRow ={vars: { a_avokaqty: 4, prepay: 1000}};
        var balance = client.BalanceHistory.TotalRepayment_IncludingOverpayments - mockRow.vars.prepay;
        var trees = (balance - 1000) / 500; 
        mockCursor.next.mockReturnValueOnce(mockRow);
        var result = avocadoEligibility(mockTable,client.AccountNumber,client);
        expect(result).toEqual(({
            possibleTrees: trees,
            balance: balance,
            orderedAvocado: mockRow.vars.a_avokaqty
        }));
    });
    it('should return the correct number of possible trees if the client ordered between above 10 trees((prepayment_amount - 1500) / 500)', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 5000;
        mockRow ={vars: { a_avokaqty: 14, prepay: 1000}};
        var balance = client.BalanceHistory.TotalRepayment_IncludingOverpayments - mockRow.vars.prepay;
        var trees = (balance - 1500) / 500; 
        mockCursor.next.mockReturnValueOnce(mockRow);
        var result = avocadoEligibility(mockTable,client.AccountNumber,client);
        expect(result).toEqual(({
            possibleTrees: trees,
            balance: balance,
            orderedAvocado: mockRow.vars.a_avokaqty
        }));
    });
});
