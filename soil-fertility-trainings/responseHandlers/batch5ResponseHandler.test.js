const batch5ResponseHandler = require('./batch5ResponseHandler');
const batch6ResponseHandler = require('./batch6ResponseHandler');

describe('batch1 messages response handler', () => {
    it('should tell ask the user reply with A or B once the response was otherwise ', () => {
        var lang = 'en-ke';
        global.content = 'K';
        var batch5Handler = batch5ResponseHandler.getHandler(lang);
        batch5Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'Reply with a or b to answer');
        expect(waitForResponse).toHaveBeenCalledWith(batch5ResponseHandler.handlerName);
    });

    it('should tell the user that the answer is correct once the user responds with a', () => {
        var lang = 'en-ke';
        global.content = ' a ';
        var batch5Handler = batch5ResponseHandler.getHandler(lang);
        batch5Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'That\'s correct! We rotate our crops to prevent disease building up on our soil and have bigger harvests!');
        expect(waitForResponse).toHaveBeenCalledWith(batch6ResponseHandler.handlerName);
    });

    it('should tell the user that the answer is incorrect once the user responds with b and give them a right solution', () => {
        var lang = 'en-ke';
        global.content = 'B';
        var batch5Handler = batch5ResponseHandler.getHandler(lang);
        batch5Handler();
        expect(sendReply).toHaveBeenNthCalledWith(1, 'That\'s incorrect. We rotate our crops to prevent disease building up on our soil and have bigger harvests!');
        expect(waitForResponse).toHaveBeenCalledWith(batch6ResponseHandler.handlerName);
    });
});
