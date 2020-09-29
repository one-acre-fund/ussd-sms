const batch1smsResponseHandler = require('./batch1smsResponseHandler');
const batch2_smsHandler = require('./batch2smsResponseHandler');

describe.each(['en-ke', 'sw'])('batch1 sms response handler using (%s) ', (lang) => {
    beforeEach(() => {
        global.content = null;
    });

    it('it should reprompt for the batch 1 response if the response is invalid --' + lang, () => {
        const handler = batch1smsResponseHandler.getHandler(lang);
        const messages = {
            'en-ke': 'Reply with a or b to answer',
            'sw': 'Chagua a au b kujibu!'
        };
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[lang]);
    });

    it('should send the 1.3 and 1.6 feedback once the user responds with A --' + lang, () => {
        const handler = batch1smsResponseHandler.getHandler(lang);
        global.content = 'A';

        const messages = [{
            'en-ke': 'Correct! Beans, eggs, omena and green leafy vegetables (Managu, Saga) are very good sources of iron. Iron makes your child smart!',
            'sw': 'Sahihi! maharagwe, mayai, omena na mboga za majani (managu) vina madini ya kuongeza damu. Madini haya hufanya mtoto wako kuwa mwerevu!'
        },{
            'en-ke': 'Which disease can we prevent by eating iron rich foods?\n' + 
            'a. Anemia or weak blood\n' + 
            'b. Night blindness\n' + 
            'c. Weak bones\n' +
            'Reply with a,b or c',
            'sw': '(3/6)Vyakula vyenye madini ya kuongeza damu mwilini huzuia ugonjwa upi?\n' +
            'a. Damu dhaifu\n' +
            'b. Upofu wa usiku\n' +
            'c. Mifupa dhaifu\n' +
            'Jibu na a, b au c'
        }];
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
    });

    it.each(['b', 'c'])('should send the 1.4, 1.5 and 1.6 feedback once the user responds with (%s) --' + lang, (choice) => {
        const handler = batch1smsResponseHandler.getHandler(lang);
        global.content = choice;

        const messages = [{
            'en-ke': 'Actually, beans have the most iron. Ugali/Rice make you full but do not contain enough iron to prevent anemia and imrove health',
            'sw': 'Maharagwe yana madini ya kuongeza damu. Ugali / Mchele hauna madini ya kuongeza damu vya kutosha kuzuia upungufu wa damu mwilini'
        },{
            'en-ke': 'Eggs, omena, and green leafy vegetables (managu, saga) are good sources of iron. Eat them with ugali & rice to make your child smart!',
            'sw': 'Mayai, omena, na mboga vina madini ya kuongeza damu mwilini. Kula pamoja na ugali na mchele kufanya mtoto wako awe mwerevu!'
        },{
            'en-ke': 'Which disease can we prevent by eating iron rich foods?\n' + 
            'a. Anemia or weak blood\n' + 
            'b. Night blindness\n' + 
            'c. Weak bones\n' +
            'Reply with a,b or c',
            'sw': '(3/6)Vyakula vyenye madini ya kuongeza damu mwilini huzuia ugonjwa upi?\n' +
            'a. Damu dhaifu\n' +
            'b. Upofu wa usiku\n' +
            'c. Mifupa dhaifu\n' +
            'Jibu na a, b au c'
        }];
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
    });

    it.each(['b', 'c'])('it should prompt for batch 2 response if the user responds with  %s--' + lang, (choice) => {
        const handler = batch1smsResponseHandler.getHandler(lang);
        global.content = choice;
        handler();
        expect(waitForResponse).toHaveBeenCalledWith(batch2_smsHandler.handlerName);
    });
});
