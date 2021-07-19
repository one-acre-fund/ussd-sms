const getKeyCodeRequest = require('./getKeyCodeRequest');
const getCurrentDate = require('../../shared/getCurrentDate');
var getShsPrice =  require('./getShsPrice');

jest.mock('../../shared/getCurrentDate');
jest.mock('./getShsPrice');

describe('get Key Code Request', () => {
    beforeAll(() => {
        getCurrentDate.mockReturnValue({geMonth: jest.fn(), geDay: jest.fn(), geYear: jest.fn(), getFullYear: jest.fn()});
        getShsPrice.mockReturnValue(20000);
    });
    it();
});
