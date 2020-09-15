const districtsInputHandler = require('./inputHandlers.js/districtInputHandler');
const sectorsInputHandler = require('./inputHandlers.js/sectorInputHandler');
// const getSectors = require('./getSectors');
const agrodealerLocator = require('./agrodealerLocator');

jest.mock('./getSectors');

describe.each(['en', 'ki'])('Agro dealer locator in (%s)', (lang) => {
    it('should register all the input handlers --' + lang, () => {
        const districtHandler = jest.fn();
        const sectorHandler = jest.fn();

        const agrodealers_address_table = 'agrodealers_address_table';
        jest.spyOn(districtsInputHandler, 'getHandler').mockReturnValueOnce(districtHandler);
        jest.spyOn(sectorsInputHandler, 'getHandler').mockReturnValueOnce(sectorHandler);
        agrodealerLocator.registerInputHandlers(lang, agrodealers_address_table);
        expect(addInputHandler).toHaveBeenCalledWith(districtsInputHandler.handlerName, districtHandler);
        expect(addInputHandler).toHaveBeenCalledWith(sectorsInputHandler.handlerName, sectorHandler);
    });

    it('should call start function --' + lang, () => {
        const screen = {'ki': 'Kubona umufatanya bikorwa ukwegereye, hitamo Akarere\n' +
        '1) Gakenke\n' +
        '2) Kayonza\n' +
        '3) Rwamagana\n' +
        '4) Gicumbi\n',
        'en': 'To find a One Acre Fund Agrodealer Partner near you, select District\n' +
    '1) Gakenke\n' +
    '2) Kayonza\n' +
    '3) Rwamagana\n' +
    '4) Gicumbi\n'};
        agrodealerLocator.start(lang);
        expect(sayText).toHaveBeenCalledWith(screen[lang]);
        expect(promptDigits).toHaveBeenCalledWith(districtsInputHandler.handlerName);
    });
});