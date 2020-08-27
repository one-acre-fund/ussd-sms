const requestLogger = require('./request-logger');

const mockResponse = {content: {some: 'content'}, status: 418};
const url = 'https://example.com';
const accountNumber = '12345678';
state.vars.account_number = accountNumber;
describe('requestLogger', () => {
    let mockRow = {save: jest.fn()};
    let  mockTable = {createRow: jest.fn(()=>mockRow)};
    project.getOrCreateDataTable.mockReturnValue(mockTable);

    it('should save to the http_response_logs table', () => {
        requestLogger(url, mockResponse);
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('http_response_logs');
        expect(project.getOrCreateDataTable).toHaveBeenCalledTimes(1);
    });
    it('should save the url, account number, status code and response content', () => {
        requestLogger(url, mockResponse);
        expect(mockTable.createRow).toHaveBeenCalledWith({vars: {
            url,account: accountNumber,status: mockResponse.status, content: mockResponse.content
        }});
        expect(mockRow.save).toHaveBeenCalled();
    });
    it('should not crash if something goes wrong', () => {
        mockRow.save.mockImplementationOnce(()=> {throw 'Just becaue';});
        requestLogger(url, mockResponse);
    });
    
});