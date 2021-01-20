const validateClient = require('./validateClient');
const triggerPayment = require('../shared/rosterApi/rosterColRequest');
const ivrRepayment = require('./ivrRepayment');

jest.mock('./validateClient');
jest.mock('../shared/rosterApi/rosterColRequest');

describe('ivr repayment', () => {
    beforeAll(() => {
        global.project.vars = {
            dev_server_name: 'dev.server.local',
            prod_server_name: 'prod.server.remote',
            dev_roster_read_key: 'dev.roster_read_key',
            prod_roster_read_key: 'prod.roster_read_key'
        };
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return false if the client is not validated', () => {
        validateClient.mockReturnValueOnce(false);
        const response = ivrRepayment('12345678', '250', '0789556765');
        expect(response).toBeFalsy();
    });

    it('should return false if the payment is not successfully triggered', () => {
        validateClient.mockReturnValueOnce(true);
        triggerPayment.mockReturnValueOnce(false);
        const response = ivrRepayment('12345678', '250', '0789556765');
        expect(response).toBeFalsy();
    });

    it('should return true if the payment is successfully triggered', () => {
        validateClient.mockReturnValueOnce(true);
        triggerPayment.mockReturnValueOnce(true);
        const response = ivrRepayment('12345678', '250', '0789556765');
        expect(response).toBeTruthy();
    });

    it('should set the server name service variable to a development variable if the service is not active ', () => {
        service.vars = {};
        service.active = false;
        validateClient.mockReturnValueOnce(false);
        ivrRepayment('12345678', '250', '0789556765');
        expect(service.vars.server_name).toEqual('dev.server.local');
        expect(service.vars.roster_read_key).toEqual('dev.roster_read_key');
    });

    it('should set the server name service variable to a development variable if the service is not active ', () => {
        service.active = true;
        validateClient.mockReturnValueOnce(false);
        ivrRepayment('12345678', '250', '0789556765');
        expect(service.vars.server_name).toEqual('prod.server.remote');
        expect(service.vars.roster_read_key).toEqual('prod.roster_read_key');
    });
});
