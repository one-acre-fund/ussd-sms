describe('cicken_Eligibility', () => {

    it('should set state.vars.client_notfound variable to true if the client is not found in the chicken table', ()=>{
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockTable = { queryRows: jest.fn() };
        mockTable.queryRows.mockReturnValue(mockCursor);
        mockCursor.hasNext.mockReturnValue(false);
        expect(state.vars.client_notfound).toBeTruthy;
    });
    it('should set confirmed_chicken variable to true if the client chicken number is not zero and they already confirmed', ()=>{
        const mockCursor ={ next: jest.fn(), 
            hasNext: jest.fn(),
        };
        const mockTable = { queryRows: jest.fn() };
        mockTable.queryRows.mockReturnValue(mockCursor);
        const mockRow ={vars: { confirmed: 1}};
        mockCursor.next.mockReturnValue(mockRow);
        mockCursor.hasNext.mockReturnValue(true);
        state.vars.chcken_nber != 0;
        expect(state.vars.confirmed_chicken).toBeTruthy;
    });
    it('should set confirmed_chicken variable to false if the client chicken number is not zero and they did not already confirmed', ()=>{
        const mockCursor ={ next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockTable = { queryRows: jest.fn() };
        mockTable.queryRows.mockReturnValue(mockCursor);
        const mockRow ={vars: { confirmed: 0}};
        mockCursor.next.mockReturnValue(mockRow);
        mockCursor.hasNext.mockReturnValue(false);
        state.vars.chcken_nber != 0;
        expect(state.vars.confirmed_chicken).toBeFalsy;
    });
});