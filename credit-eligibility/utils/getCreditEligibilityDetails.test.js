const getCreditEligibilityDetails = require('./getEligibilityDetails');

describe('get credit eligibility details', () => {
    const tableMock = {queryRows: jest.fn()};
    const mockRow = {hasNext: jest.fn(), next: jest.fn()};

    beforeEach(() => {
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValueOnce(mockRow);
    });

    it('it should return null if the client is not found', () => {
        const client = {AccountNumber: '43674682'};
        jest.spyOn(mockRow, 'hasNext').mockReturnValueOnce(false);
        const response = getCreditEligibilityDetails(client);
        expect(response).toEqual(null);
    });

    it('it should return null if the client is not found', () => {
        const mockResponse = {
            min_credit: 123, 
            max_credit: 500, 
            prepayment: 200, 
            solar_eligibility: 'YES', 
            outstanding_amount: 300, 
            eligibility_reason: 'You have paid your debt', 
            eligibility_decision: 'YES'};

        const client = {AccountNumber: '43674682'};
        jest.spyOn(mockRow, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(mockRow, 'next').mockReturnValueOnce({vars: mockResponse});
        const response = getCreditEligibilityDetails(client);
        expect(response).toEqual({'eligibility_decision': 'YES', 'max_credit': 500, 'min_credit': 123, 'outstanding_amount': 300, 'pre_payment': 200, 'reason': 'You have paid your debt', 'solar': 'YES'});
    });
});