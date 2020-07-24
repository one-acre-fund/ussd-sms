const getClient = require('./getClient');

describe('Fetch client', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('it should fetch client successfully', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content});
        const result = getClient('199231', 'rw');
        expect(result).toEqual({});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 400, content});
        const result = getClient('199231', 'rw');
        expect(result).toEqual(undefined);
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockRejectedValue(new Error('Error'));
        const result = getClient('199231', 'rw');
        expect(result).toEqual(undefined);
    });
});
