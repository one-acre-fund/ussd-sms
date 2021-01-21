const invalidAttempts = require('./invalidAttempts');

describe('Invalid input attempts', () => {
    beforeEach(() => {
        state.vars = {};
    });

    it('plays error message and hangs up if attempts exceed the max', () => {
        state.vars.invalidInputAttempts = 2;
        invalidAttempts.check(2, 'en');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611061658/4868df5e9317/error.mp3');
        expect(hangUp).toHaveBeenCalled();
    });

    it('only increments number of invalid attempts if max is not exceeded', () => {
        state.vars.invalidInputAttempts = 1;
        invalidAttempts.check(2, 'en');
        expect(state.vars.invalidInputAttempts).toEqual(2);
        expect(playAudio).not.toHaveBeenCalled();
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('increments number of invalid attempts if check is called but no invalid attempts record exists', () => {
        invalidAttempts.check(2, 'en');
        expect(state.vars.invalidInputAttempts).toEqual(1);
    });

    it('resets the number of invalid attempts when clear is called', () => {
        state.vars.invalidInputAttempts = 2;
        invalidAttempts.clear();
        expect(state.vars.invalidInputAttempts).toEqual(0);
    });

    it('does nothing if clear is called when no invalid attempt record exists', () => {
        invalidAttempts.clear();
        expect(state.vars.invalidInputAttempts).toBe(undefined);
    });
});