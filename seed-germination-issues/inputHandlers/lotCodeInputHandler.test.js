const lotCodeinputHandler = require('./lotCodeInputHandler');
const dukaInputHandler = require('./dukaInputHandler');

describe('Lotcode input handler', () => {
    it('should save the necessary state variables', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('AMRNGKZ');
        expect(state.vars.duka_option_values).toEqual('{"1":"kak","2":"mal","3":"ing","4":"bun","5":"malak",' +
         '"6":"kap","7":"kab","8":"nyan","9":"yal","10":"lua"}');
        expect(state.vars.duka_screens).toEqual('{"1":"In which Duka did you purchase the seed?\\n1) Kakamega Duka\\n' + 
        '2) Malava Duka\\n3) Ingotse Duka\\n4) Bungoma Duka\\n5) Malakisi Duka\\n77) Next","2":"6) Kapsabet Duka\\n' + 
        '7) Kabiyet Duka\\n8) Nyang\'oma Kogelo Duka\\n9) Yala Duka\\n10) Luanda Duka\\n"}');
        expect(state.vars.current_dukas_menu).toEqual(1);
    });

    it('should prompt for the month', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('AMRNGKZ');
        expect(sayText).toHaveBeenCalledWith('In which Duka did you purchase the seed?\n' +
        '1) Kakamega Duka\n' +
        '2) Malava Duka\n' +
        '3) Ingotse Duka\n' +
        '4) Bungoma Duka\n' +
        '5) Malakisi Duka\n' +
        '77) Next');
        expect(promptDigits).toHaveBeenCalledWith(dukaInputHandler.handlerName);
    });
});
