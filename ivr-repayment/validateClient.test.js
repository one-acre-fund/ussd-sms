const rosterAPI = require('../rw-legacy/lib/roster/api');
const getClient = require('../shared/rosterApi/getClient');
const validateClient = require('./validateClient');

jest.mock('../rw-legacy/lib/roster/api');
jest.mock('../shared/rosterApi/getClient');

describe('validate account', () => {
    it('should authenticate the client', () => {
        jest.spyOn(rosterAPI, 'authClient').mockReturnValueOnce(true);
        validateClient('12345678');
        expect(rosterAPI.authClient).toHaveBeenCalledWith('12345678', 'KE');
        expect(getClient).toHaveBeenCalledWith('12345678', 'KE');
    });

    it('should return a client object when client exists', () => {
        jest.spyOn(rosterAPI, 'authClient').mockReturnValueOnce(true);
        getClient.mockReturnValueOnce({AccountNumber: '12345678'});
        var response = validateClient('12345678');
        expect(response).toEqual({AccountNumber: '12345678'});
    });

    it('should return false once there is an issue authenticating client', () => {
        jest.spyOn(rosterAPI, 'authClient').mockReturnValueOnce(false);
        var response = validateClient('12345678');
        expect(response).toEqual(false);
    });
});
