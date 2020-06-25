var slack = require('.');

project.vars.slack_log_key = '/slack/webhook/indentifier';
describe('slack', () => {
    it('should have a log function', () => {
        expect(slack.log).toBeInstanceOf(Function);
    });
    describe('slack.log', () => {
        it('should make an http request', () => {
            const exampleMessage = 'Exammple Log message';
            slack.log(exampleMessage);
            expect(httpClient.request).toHaveBeenLastCalledWith(
                'https://hooks.slack.com/services'+project.vars.slack_log_key,{
                    method: 'POST',
                    data: JSON.stringify({ text: exampleMessage })
                }
            );
        });
    });
});