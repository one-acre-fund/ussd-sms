
const chickenEligibility = require('./chickenEligibility');
const {client}  = require('../test-client-data');


describe('chicken_Eligibility', () => {

    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockTable = { queryRows: jest.fn() };
    mockTable.queryRows.mockReturnValue(mockCursor);
    var mockRow ={vars: { ordered_chickens: 4, confirmed: 1, prep_required: 128000}};
    beforeAll(()=>{
        project.vars.chickenRequiredPercentage = 53;
        project.vars.creditCycleChickenService = '2021A';
    });
    beforeEach(() => {
        sayText.mockClear();
        promptDigits.mockClear();
        JSON.parse = jest.fn().mockImplementation(() => {
            return client ;
        });
    });

    it('should set the state.vars.max_chicken to 15 if the client\'s ordered chicken number is zero', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 0}};
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.max_chicken).toBe(15);
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
        client.BalanceHistory.TotalCreditPerCycle[project.vars.creditCycleChickenService]  = 0;
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.minimum_amount_paid).toBeTruthy();
    });
    it('should set state.vars.max_chicken to 15 if the client is eligible to confirm more than the max(15) chickens', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var new_row ={vars: { ordered_chickens: 16, confirmed: 0,prep_required: 20000}};
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 10000;
        mockCursor.next.mockReturnValueOnce(new_row);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.max_chicken).toBe(15);
    });
    it('should set state.vars.max_chicken to the number of possible chicken given the prepayment_amount (if the prepayment is greater than 1000 and allows less than 5 possible chicken)', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var new_row ={vars: { ordered_chickens: 4, confirmed: 0}};
        client.BalanceHistory.TotalCreditPerCycle[project.vars.creditCycleChickenService] = 3773.5;
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
    it('should set  state.vars.client_notfound to true if the current crediCycle is not found', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockRow ={vars: { ordered_chickens: 4, confirmed: 0,prep_required: 2000}};
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 2500;
        client.BalanceHistory.TotalCreditPerCycle = {
            '2019A': 1234.00,
            '2019B': 3000.00
        };
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.client_notfound).toBeTruthy();
    });
});
