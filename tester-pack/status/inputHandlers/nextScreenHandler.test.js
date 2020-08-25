const nextScreenHandler = require('./nextScreensHandler');

describe('next page handler', () => {
    it('should take user on 77 to a next screen if it is available', () => {
        state.vars.current_screen = 1;
        state.vars.screens = JSON.stringify({'1': 'page1', '2': 'Registration\n1) Tyrion Lanister\n2) Jon Snow'});
        nextScreenHandler('77');
        expect(sayText).toHaveBeenCalledWith('Registration\n1) Tyrion Lanister\n2) Jon Snow');
    });

    it('should prompt user to go to another page if it is available', () => {
        state.vars.current_screen = 1;
        state.vars.screens = JSON.stringify({'1': 'page1', '2': 'Registration\n1) Tyrion Lanister\n2) Jon Snow', '3': '3) The hound'});
        nextScreenHandler('77');
        expect(sayText).toHaveBeenCalledWith('Registration\n1) Tyrion Lanister\n2) Jon Snow');
        expect(promptDigits).toHaveBeenCalledWith('next_farmers_list', {
            maxDigits: 1,
            timeout: 10,
            submitOnHash: false
        });
    });
});
