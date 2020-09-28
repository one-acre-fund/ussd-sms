var sms1_7ResponseHandler = require('./batch2smsResponseHandler');

describe.each(['en-ke', 'sw'])('1.7 sms response handler using (%s) ', (lang) => {
    beforeEach(() => {
        global.content = null;
    });

    it('it should reprompt for the batch 2 response if the response is invalid --' + lang, () => {
        const handler = sms1_7ResponseHandler.getHandler(lang);
        const messages = {
            'en-ke': 'Reply with a or b to answer',
            'sw': 'Chagua a au b kujibu!'
        };
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[lang]);
    });

    it('should send the 1.7 feedback once the user responds with A --' + lang, () => {
        const handler = sms1_7ResponseHandler.getHandler(lang);
        global.content = 'A';

        const messages = [{
            'en-ke': 'Correct! Anemia (weak blood) is common in our families. It makes children develop poorly so they do badly in school and are unhealthy',
            'sw': 'Sahihi! damu dhaifu ipo kwa jamii na familia zetu na inafanya watoto wawe na ukuaji duni, kufanya vibaya shuleni na  wenye afya duni.'
        },{
            'en-ke': 'Anemia can be prevented by eating iron rich foods. Iron-rich foods makes your child active, strong and bright',
            'sw': '(4/6)Zuia damu dhaifu kwa kula vyakula vyenye madini ya kuongeza damu. Vyakula hivi hufanya mtoto kua mchangamfu, mwenye nguvu na mwerevu'
        },{
            'en-ke': 'You can get eggs, beans and vegetables from your farm and save money! Plant beans in small quantities and rear chicken for eggs.',
            'sw': '(5/6)Unaweza kupata mayai, maharagwe na mboga kutoka shamba lako na kuokoa pesa! Panda maharagwe na ufuge kuku wa mayai. '
        }];
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
    });

    it.each(['b', 'c'])('should send the 1.8 feedback once the user responds with (%s)--' + lang, (choice) => {
        const handler = sms1_7ResponseHandler.getHandler(lang);
        global.content = choice;

        const messages = [{
            'en-ke': 'The correct answer is anemia or weak blood. Not eating enough iron-rich foods causes anemia.',
            'sw': 'Jibu sahihi ni upungufu wa damu mwilini. Kula chakula cha kutosha chenye madini ya kuongeza damu husababisha upungufu wa damu mwilini'
        },{
            'en-ke': 'Anemia can be prevented by eating iron rich foods. Iron-rich foods makes your child active, strong and bright',
            'sw': '(4/6)Zuia damu dhaifu kwa kula vyakula vyenye madini ya kuongeza damu. Vyakula hivi hufanya mtoto kua mchangamfu, mwenye nguvu na mwerevu'
        },{
            'en-ke': 'You can get eggs, beans and vegetables from your farm and save money! Plant beans in small quantities and rear chicken for eggs.',
            'sw': '(5/6)Unaweza kupata mayai, maharagwe na mboga kutoka shamba lako na kuokoa pesa! Panda maharagwe na ufuge kuku wa mayai. '
        }];
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
        expect(sendReply).toHaveBeenCalledWith(messages[0][lang]);
    });
});
