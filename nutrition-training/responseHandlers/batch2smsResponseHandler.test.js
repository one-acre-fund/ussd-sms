var sms1_7ResponseHandler = require('./batch2smsResponseHandler');

describe.each(['en-ke', 'sw'])('1.7 sms response handler using (%s) ', (lang) => {
    it('it should start the service', () => {
        const handler = sms1_7ResponseHandler.getHandler(lang);
        handler();
    });
});
