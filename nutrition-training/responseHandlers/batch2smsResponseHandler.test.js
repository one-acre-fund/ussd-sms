var batch2smsHandler = require('./batch2smsResponseHandler');

describe.each(['en-ke', 'sw'])('1.7 sms response handler using (%s) ', (lang) => {
    beforeEach(() => {
        global.content = null;
        contact.phone_number = '0788665432';
    });

    it('it should reprompt for the batch 2 response if the response is invalid --' + lang, () => {
        const handler = batch2smsHandler.getHandler(lang);
        const messages = {
            'en-ke': 'Reply with a, b or c to answer',
            'sw': 'Chagua a, b au c kujibu!'
        };
        handler();
        expect(sendReply).toHaveBeenCalledWith(messages[lang]);
        expect(waitForResponse).toHaveBeenCalledWith(batch2smsHandler.handlerName);
    });

    it('should send the 1.7 feedback once the user responds with A --' + lang, () => {
        const handler = batch2smsHandler.getHandler(lang);
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
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(1, {'content': messages[0][lang], 'start_time_offset': 0, 
            'to_number': '0788665432'});
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(2, {'content': messages[1][lang], 'start_time_offset': 15, 
            'to_number': '0788665432'});
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(3, {'content': messages[2][lang], 'start_time_offset': 30, 
            'to_number': '0788665432'});
    });

    it.each(['b', 'c'])('should send the 1.8 feedback once the user responds with (%s)--' + lang, (choice) => {
        const handler = batch2smsHandler.getHandler(lang);
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
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(1, {'content': messages[0][lang], 'start_time_offset': 0, 
            'to_number': '0788665432'});
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(2, {'content': messages[1][lang], 'start_time_offset': 15, 
            'to_number': '0788665432'});
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(3, {'content': messages[2][lang], 'start_time_offset': 30, 
            'to_number': '0788665432'});
    });
});
