const registeredConfirmed = require('./registeredConfirmedHandler');

describe('registered and confirmed', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'}};
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should display a list of registered farmers when farmer promoter chooses 1', () => {
        // sample test
        state.vars.farmers = JSON.stringify({
            registered: {
                1: {first_name: 'Jon',last_name: 'Snow'},
                2: {first_name: 'Samuel',last_name: 'Tally'},
                3: {first_name: 'Tyrion',last_name: 'Lanister'},
                4: {first_name: 'Jon',last_name: 'Snow'},
                5: {first_name: 'Samuel',last_name: 'Tally'},
                6: {first_name: 'Tyrion',last_name: 'Lanister'},
                7: {first_name: 'Jon',last_name: 'Snow'},
                8: {first_name: 'Samuel',last_name: 'Tally'},
                9: {first_name: 'Tyrion',last_name: 'Lanister'},
                10: {first_name: 'Jon',last_name: 'Snow'},
                11: {first_name: 'Samuel',last_name: 'Tally'},
                12: {first_name: 'Tyrion',last_name: 'Lanister'},
            }});
        registeredConfirmed(1);
        expect(sayText).toHaveBeenCalledWith('Registration\n1) Jon Snow\n' +
        '2) Samuel Tally\n' +
        '3) Tyrion Lanister\n' +
        '4) Jon Snow\n' +
        '5) Samuel Tally\n' +
        '6) Tyrion Lanister\n' +
        '7) Jon Snow\n' +
        '77) Next');
        expect(state.vars.screens).toEqual('{"1":"Registration\\n1) Jon Snow\\n2) Samuel Tally\\n3) Tyrion Lanister\\n4) Jon Snow\\n5) Samuel Tally\\n6) Tyrion Lanister\\n7) Jon Snow\\n77) Next","2":"8) Samuel Tally\\n9) Tyrion Lanister\\n10) Jon Snow\\n11) Samuel Tally\\n12) Tyrion Lanister\\n"}');
        expect(promptDigits).toHaveBeenCalledWith('next_farmers_list', {
            maxDigits: 2,
            timeout: 10,
            submitOnHash: false
        });

    });

    it('should display a list of confirmed farmers when farmer promoter chooses 2', () => {
        // sample test
        state.vars.farmers = JSON.stringify({
            confirmed: {
                1: {first_name: 'Jon',last_name: 'Snow'},
                2: {first_name: 'Samuel',last_name: 'Tally'},
                3: {first_name: 'Tyrion',last_name: 'Lanister'},
                4: {first_name: 'Jon',last_name: 'Snow'},
                5: {first_name: 'Samuel',last_name: 'Tally'},
                6: {first_name: 'Tyrion',last_name: 'Lanister'},
                7: {first_name: 'Jon',last_name: 'Snow'},
                8: {first_name: 'Samuel',last_name: 'Tally'},
                9: {first_name: 'Tyrion',last_name: 'Lanister'},
                10: {first_name: 'Jon',last_name: 'Snow'},
                11: {first_name: 'Samuel',last_name: 'Tally'},
                12: {first_name: 'Tyrion',last_name: 'Lanister'}
            }});
        registeredConfirmed(2);
        expect(sayText).toHaveBeenCalledWith('Confirmed\n1) Jon Snow\n' +
        '2) Samuel Tally\n' +
        '3) Tyrion Lanister\n' +
        '4) Jon Snow\n' +
        '5) Samuel Tally\n' +
        '6) Tyrion Lanister\n' +
        '7) Jon Snow\n' +
        '8) Samuel Tally\n' +
        '77) Next');
        expect(promptDigits).toHaveBeenCalledWith('next_farmers_list', {
            maxDigits: 2,
            timeout: 10,
            submitOnHash: false
        });
        expect(state.vars.screens).toEqual('{"1":"Confirmed\\n1) Jon Snow\\n2) Samuel Tally\\n3) Tyrion Lanister\\n4) Jon Snow\\n5) Samuel Tally\\n6) Tyrion Lanister\\n7) Jon Snow\\n8) Samuel Tally\\n77) Next","2":"8) Samuel Tally\\n9) Tyrion Lanister\\n10) Jon Snow\\n11) Samuel Tally\\n12) Tyrion Lanister\\n"}');

    });

    it('should give farmer another try when their input doesn\'t match the given 1 and 2', () => {
        state.vars.farmers = JSON.stringify({registered: {
            1: {first_name: 'Jon',last_name: 'Snow'},
            2: {first_name: 'Samuel',last_name: 'Tally'},
            3: {first_name: 'Tyrion',last_name: 'Lanister'},
        },
        confirmed: {
            1: {first_name: 'Jon',last_name: 'Snow'},
            2: {first_name: 'Samuel',last_name: 'Tally'},
        }});
        registeredConfirmed('000');
        expect(sayText).toBeCalledWith('Invalid input try again\n1) Registration= 3\n2) Confirmed= 2');
    });
});
