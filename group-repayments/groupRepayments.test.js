const groupRepayments = require('./groupRepayments');

describe('Back to group summary handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should register input handlers', () => {
        groupRepayments.registerGroupRepaymentHandlers({});
        var groupSummaryHandler = require('./inputHandlers/groupSummaryHandler');
        var individualBalanceHandler = require('./inputHandlers/individualBalanceHandler');
        var lastFourIdDigitsHandler = require('./inputHandlers/lastFourIdDigitsHandler');

        expect(addInputHandler).toHaveBeenCalledTimes(3);
        expect(addInputHandler).toHaveBeenCalledWith('enter_last_four_id_digits', lastFourIdDigitsHandler);
        expect(addInputHandler).toHaveBeenCalledWith('view_individual_balance_menu', individualBalanceHandler);
        expect(addInputHandler).toHaveBeenCalledWith('back_to_group_summary', groupSummaryHandler);
    });

    it('should start the group repayment session', () => {
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content: JSON.stringify({})});
        groupRepayments.startGroupRepayments({lang: 'en'});
        expect(sayText).toHaveBeenCalledWith('Please enter the last four digits of the national ID you registered with');
    });
});
