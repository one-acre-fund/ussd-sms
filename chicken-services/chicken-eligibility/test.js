const slack = require('../../slack-logger');
const chickenEligibility = require('./index');
const {client}  = require('../test-client-data');

jest.mock('../../slack-logger');

describe('cicken_Eligibility', () => {

    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockTable = { queryRows: jest.fn() };
    mockTable.queryRows.mockReturnValue(mockCursor);
    var mockRow ={vars: { ordered_chickens: 4, confirmed: 1}};
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
    it('should slack a message saying the client is not found if the client is not found in the chicken table', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.client_notfound).toBeTruthy();
        expect(slack.log).toHaveBeenCalledWith(expect.stringContaining(`Client ${client.FirstName} `+
        'not found in chicken table'));
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
        mockRow ={vars: { ordered_Chickens: 4, confirmed: 0}};
        mockCursor.next.mockReturnValueOnce(mockRow);
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.confirmed_chicken).toBeDefined();
    });
    it('should set state.vars.minimum_amount_paid to true if  prepayment_amount is greater than 1000', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 10000;
        client.BalanceHistory.TotalCredit = 2000;
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.minimum_amount_paid).toBeTruthy();
    });
    it('should set state.vars.max_chicken to 15 if prepayment_amount is greater than 7500', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 10000;
        client.BalanceHistory.TotalCredit = 2000;
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.max_chicken).toBe(15);
    });
    it('should set state.vars.minimum_amount_paid to False if prepayment_amount is less than 1000', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false);
        client.BalanceHistory.TotalRepayment_IncludingOverpayments = 2500;
        client.BalanceHistory.TotalCredit = 2000;
        chickenEligibility(mockTable,client.AccountNumber,client);
        expect(state.vars.minimum_amount_paid).toBeFalsy();
    });
});