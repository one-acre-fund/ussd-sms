
const elkNotify = require('../elk-notification/elkNotification');
const Log = require('../../logger/elk/elk-logger');
jest.mock('../../logger/elk/elk-logger');
const mockGoodResponse = {response: {status: 200}};
const mockBadResponse = {response: {status: 404}};
var mockTable ={createRow: jest.fn()};
var mockRow ={save: jest.fn()};
describe('elkNotification', () => {
    beforeAll(()=>{
        project.vars.elk_request_table_id ='1213';
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.createRow.mockReturnValue(mockRow);
    });
    let mockLogger;
    beforeEach(()=>{
        service.vars.server_name = 'http/example.com';
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        Log.mockReturnValue(mockLogger);
    });

    it('should be a function', () => {
        expect(elkNotify).toBeInstanceOf(Function);
    });
    it('should call Http.request', () => {
        httpClient.request.mockReturnValueOnce(mockGoodResponse);
        elkNotify();
        expect(httpClient.request).toHaveBeenCalled();
    });
    it('should call slack when the response code is not 200', () => {
        httpClient.request.mockReturnValueOnce(mockBadResponse);
        elkNotify();
        expect(mockLogger.warn).toHaveBeenCalledWith('Failed to send ELK notification :', { data: mockBadResponse});
    });
    it('should log the error if an error occurs',()=>{
        const error = new Error('Failed to notify');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        elkNotify();
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to send a request on 1st attempt to notify ELK:',{ data: error});
    });
    it('should send another request if the first one fails to respond',()=>{
        const error = new Error('Failed to respond');
        httpClient.request.mockImplementationOnce(()=>{throw error;});
        elkNotify();
        expect(httpClient.request).toHaveBeenCalledTimes(2);
    });
    it('should log the error the second error if it occurs ',()=>{
        const error = new Error('Failed to notify');
        httpClient.request.mockImplementationOnce(()=>{throw error;}).mockImplementationOnce(()=>{throw error;});
        elkNotify();
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to send a request on the last attempt for notify ELK:',{ data: error});
    });
});