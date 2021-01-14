const validateClient = require('./validateClient');
const triggerPayment = require('../shared/rosterApi/rosterColRequest');
const ivrRepayment = require('./ivrRepayment');

jest.mock('./validateClient');
jest.mock('../shared/rosterApi/rosterColRequest');

describe('ivr repayment', () => {
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
});
