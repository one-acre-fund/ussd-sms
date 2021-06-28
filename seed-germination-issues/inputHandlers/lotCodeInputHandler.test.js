const lotCodeinputHandler = require('./lotCodeInputHandler');
const dukaInputHandler = require('./dukaInputHandler');

describe('Lotcode input handler', () => {
    it('should save the necessary state variables', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('AMRNGKZ');
        expect(state.vars.lot_code).toEqual('AMRNGKZ');
    });

    it('should prompt for the duka if the lotcode is valid', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('AMRNGKZ');
        expect(sayText).toHaveBeenCalledWith('In which Duka did you purchase the seed?');
        expect(promptDigits).toHaveBeenCalledWith(dukaInputHandler.handlerName);
    });
});
