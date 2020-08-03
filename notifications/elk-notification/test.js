
const elkNotify = require('../elk-notification/elkNotification');
const slack = require('../../slack-logger/index');
jest.mock('../../slack-logger');
const mockGoodResponse = {response: {status: 200}};
const mockBadResponse = {response: {status: 404}};
describe('elkNotification', () => {
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
});