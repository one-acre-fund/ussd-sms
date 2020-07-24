const getClient = require('./checkForGroupLeader');
const slack = require('../../slack-logger/index');

describe('Fetch client', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('it should fetch data successfully', () => {
        const content = JSON.stringify({isGroupLeader: true});
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content});
        const result = getClient(435, 234);
        expect(result).toEqual(true);
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({error: 'bad request'});
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 400, content});
        const result = getClient(972, 345);
        expect(result).toEqual(undefined);
    });

    it('it should handle the  unresolved promise error', () => {
        const mockError = new Error('network error');
        jest.spyOn(slack, 'log');
        jest.spyOn(httpClient, 'request').mockImplementationOnce(() => {
            throw mockError;
        });
        const result = getClient(2837, 4345);
        expect(slack.log).toHaveBeenCalledWith(mockError);
        expect(result).toEqual(undefined);
    });
});
