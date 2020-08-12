const getPhoneNumber = require('./getPhoneNumber');
var logger = require('../../slack-logger/index');

jest.mock('../../slack-logger/index');

describe('Fetch Phone Number', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
        jest.spyOn(logger, 'log');
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('it should fetch phone number successfully', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content});
        const result = getPhoneNumber('27362ad-adf4-2fa-sdf2-2');
        expect(result).toEqual({});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 400, content});
        const result = getPhoneNumber('27362ad-adf4-2fa-sdf2-2');
        expect(result).toEqual(undefined);
        expect(logger.log).toHaveBeenCalledWith('Error while fetching client phone number{"status":400,"content":"{}"}');
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce(new Error('Error'));
        const result = getPhoneNumber('27362ad-adf4-2fa-sdf2-2');
        expect(result).toEqual(undefined);
        expect(logger.log).toHaveBeenCalledWith('Error while fetching client phone number{}');
    });
});
