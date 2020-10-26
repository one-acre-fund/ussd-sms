const calculate = require('./healthyPathCalculator');

describe('Healthy Path calculator', () => {
    it('should calculate the journey to the health path', () => {
        var path = calculate(0.3, 150, 27);
        expect(typeof path).toBe('number');
        expect(path).toEqual(18);
    });
});
