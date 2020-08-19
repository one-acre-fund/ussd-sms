var getClient = require('./getClient');

describe('get client', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should return a valid client', () => {
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content: JSON.stringify({accountNumber: '12000123', name: 'Adonis Lags'})});
        const client = getClient('12000123');
        expect(client).toEqual( {'client': {'accountNumber': '12000123', 'name': 'Adonis Lags'}});
    });

    it('should return error message if account number is not valid', () => {
        const client = getClient('12032');
        expect(client).toEqual( {'error_message': 'Incorrect input. Please re-enter the account number (8 digits)'});
    });

    it('should return error message if account number is not recorded in roster', () => {
        const client = getClient('12000123');
        expect(client).toEqual( {'error_message': 'Account number not found in Roster. Please re-enter the account number'});
    });
});