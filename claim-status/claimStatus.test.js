var claimStatus = require('./claimStatus');
var claimTypeInputHandler = require('./inputHandlers/claimTypeInputHandler');

describe('claim status', () => {
    it.each(['en-ke', 'sw'])('should start the claim status and ask for claim type --using(%s)', (lang) => {
        claimStatus.start(lang);
        var messages = {
            'en-ke': '1. Funeral Insurance\n2. Health Insurance',
            'sw': '1. Bima ya mazishi\n2. Bima ya Afya'
        };
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(claimTypeInputHandler.handlerName);
    });
});
