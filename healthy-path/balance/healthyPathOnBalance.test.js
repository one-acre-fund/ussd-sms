const HealthyPathMessage = require('./healthyPathOnBalance');
const fetchHealthyPathData = require('../utils/getHealthyPathPercentage');
jest.mock('../utils/getHealthyPathPercentage');

describe('Healthy path on Balance screen', () => {
    beforeAll(() => {
        fetchHealthyPathData.mockReturnValue(0.3);
    });
    it('should return a message when the user is below the healthy path', () => {
        var message = HealthyPathMessage(1, 2, 3, 150, 24, 'en');
        expect(message).toBe('Healthy Path Status: 21 below healthy path\n');
    });
    it('should return a message when the user is above the healthy path', () => {
        var message = HealthyPathMessage(1, 2, 3, 150, 50, 'en');
        expect(message).toBe('Healthy Path Status: 5 above healthy path\n');
    });
});