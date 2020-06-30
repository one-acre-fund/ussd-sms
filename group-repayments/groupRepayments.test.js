const groupRepayments = require('./index');

describe.only('Back to group summary handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should register input handlers', () => {
        groupRepayments.registerGroupRepaymentHandlers({});
        expect(addInputHandler).toHaveBeenCalledTimes(3);
    });

    it('should spin the group repayment session', () => {
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content: JSON.stringify({})});
        groupRepayments.spinGroupRepayments({lang: 'en'});
        expect(sayText).toHaveBeenCalledWith('Please enter the last four digits of the national ID you registered with');
    });
});
