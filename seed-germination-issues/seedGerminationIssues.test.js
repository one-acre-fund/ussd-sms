const seedGerminationIssues = require('./seedGerminationIssues');
const customSeedVarietyInputHandler = require('./inputHandlers/customSeedVarietyInputHandler');
const registerInputHandlers = require('./inputHandlers/registerInputHandlers');

describe('seed germination issues', () => {
    it('should start the seed germination issues', () => {
        seedGerminationIssues.start('en-ke');
        expect(sayText).toHaveBeenCalledWith('Please write the name of the seed variety you purchased in the Duka.');
        expect(promptDigits).toHaveBeenCalledWith(customSeedVarietyInputHandler.handlerName);
    });

    it('should export the registerInputHandlers', () => {
        expect(seedGerminationIssues.registerInputHandlers).toEqual(registerInputHandlers);
    });
});