
const chickenEligibility = require('./chickenEligibility');
const {client}  = require('../test-client-data');


describe('chicken_Eligibility', () => {

    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockTable = { queryRows: jest.fn() };
    mockTable.queryRows.mockReturnValue(mockCursor);
    var mockRow ={vars: { ordered_chickens: 4, confirmed: 1, prep_required: 128000}};
    beforeEach(() => {
        sayText.mockClear();
        promptDigits.mockClear();
        JSON.parse = jest.fn().mockImplementation(() => {
            return client ;
        });
    });

    it('should not define confirmed_chicken variable if the client chicken number is zero', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 0}};
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.confirmed_chicken).not.toBeDefined();
    });
    it('should set state.vars.client_notfound variable to not defined if the client is not found in the chicken table', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.client_notfound).not.toBeDefined();
    });

    it('should set state.vars.client_notfound variable to true if the client is not found in the chicken table', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.client_notfound).toBeTruthy();
    });
    
    it('should set confirmed_chicken variable to true if the client chicken number is not zero and they already confirmed', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 4, confirmed: 1}};
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.confirmed_chicken).toBeTruthy();
    });
    it('should set confirmed_chicken variable to false if the client chicken number is not zero and they have not confirmed', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 4, confirmed: 0}};
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.confirmed_chicken).toBeFalsy();
    });
    it('should define confirmed_chicken variable if the client chicken number is not zero and they have not confirmed', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 4, confirmed: 0}};
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.confirmed_chicken).toBeDefined();
    });
    it('should set state.vars.minimum_amount_paid to true if  prepayment_amount is greater than 1000', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 10000;
        mockRow.vars.prep_required = 0;
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.minimum_amount_paid).toBeTruthy();
    });
    it('should set state.vars.max_chicken to 4 if prepayment_amount is greater than 7500 but the client ordered less than the maximum number of chickens that can be ordered', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var new_row ={vars: { ordered_chickens: 4, confirmed: 0,prep_required: 2000}};
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 10000;
        mockCursor.next.mockReturnValueOnce(new_row);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.max_chicken).toBe(4);
    });
    it('should set state.vars.max_chicken to the number of possible chicken given the prepayment_amount (if the prepayment is greater than 1000 and allows less than 5 possible chicken)', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var new_row ={vars: { ordered_chickens: 4, confirmed: 0,prep_required: 2000}};
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 4000;
        mockCursor.next.mockReturnValueOnce(new_row);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.max_chicken).toBe(4);
    });
    it('should set state.vars.minimum_amount_paid to False if prepayment_amount is less than 1000', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 4, confirmed: 0,prep_required: 2000}};
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 2500;
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.minimum_amount_paid).toBeFalsy();
    });
});
