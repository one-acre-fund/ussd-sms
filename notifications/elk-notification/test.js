
const elkNotify = require('../elk-notification/elkNotification');
const slack = require('../../slack-logger/index');
jest.mock('../../slack-logger');
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
        expect(slack.log).toHaveBeenCalledWith(expect.stringContaining('Failed to send ELK notification :'));
    });
    it('should save a row with the requests',()=>{
        httpClient.request.mockReturnValueOnce(mockBadResponse);
        elkNotify();
        expect(mockTable.createRow).toHaveBeenCalledWith(expect.objectContaining({'contact_id': contact.id,
            'from_number': contact.from_number,
            'name': contact.name,
            'response': JSON.stringify(mockBadResponse)
        }));
        expect(mockRow.save).toHaveBeenCalled();
    });
});