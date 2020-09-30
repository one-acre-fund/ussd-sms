const registerClient = require('./registerClient');
var logger = require('../../logger/elk/elk-logger');

jest.mock('../../logger/elk/elk-logger');

var client = {
    'districtId': 1404,
    'siteId': 4,
    'groupId': 20,
    'firstName': 'Tyrion',
    'lastName': 'Lanyster',
    'nationalIdNumber': '1123341232',
    'phoneNumber': '0787334524'
};

describe('Register client', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    let mockLogger;
    beforeEach(() => {
        service.vars.server_name = 'http/example.com';
        mockLogger = {
            error: jest.fn(),
            warn: jest.fn()
        };
        logger.mockReturnValue(mockLogger);
        jest.resetModules();
    });
    it('it should register client successfully', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content});
        const result = registerClient(client);
        expect(httpClient.request).toHaveBeenCalledWith('http/example.com/Api/Registrations/RegisterClient',
            {'data': 
                '{"districtId":1404,"siteId":4,"groupId":20,"firstName":"Tyrion","lastName":"Lanyster","nationalIdNumber":"1123341232","phoneNumber":"0787334524"}',
            'headers': {
                'Authorization': 'Token undefined', 'Content-Type': 'application/json'},
            'method': 'POST'
            });
        expect(result).toEqual({});
    });

    it('it should handle the  http error with status code other than 200', () => {
        const content = JSON.stringify({});
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 400, content});
        const result = registerClient(client);
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while registering user', {'data': '{"status":400,"content":"{}"}'});
    });

    it('it should handle the  unresolved promise error', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce(new Error('Error'));
        const result = registerClient(client);
        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith('Error while registering user', {'data': '{}'});
    });
});
