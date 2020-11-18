const contactCallCenter = require('./contactCallCenter');

describe('contact call center', () => {
    it('should show menu for clients', () => {
        contactCallCenter.start('en-ke', true);
        expect(sayText).toHaveBeenCalledWith('1) Help on payment issues\n' +
        '2) Help on solar activation\n' +
        '3) Help on insurance issue\n' +
        '4) Help on waranty issue\n' +
        '77) Continue');
    });

    it('should show menu for clients', () => {
        contactCallCenter.start('en-ke', false);
        expect(sayText).toHaveBeenCalledWith('1) Call back support for duka client\n' +
        '2) Call back support for Angaza client\n' +
        '3) Call back support for potential client\n');
    });

    it('should set the necessary state variables', () => {
        contactCallCenter.start('en-ke', true);
        expect(state.vars.ccc_screens).toEqual({'1': '1) Help on payment issues\n' +
        '2) Help on solar activation\n' +
        '3) Help on insurance issue\n' +
        '4) Help on waranty issue\n' +
        '77) Continue', '2': '5) General inquiry\n' +
        '6) Help on enrollment issues\n'});
        expect(state.vars.ccc_options).toEqual({'1': 'Payment Issue', 
            '2': 'Solar Registration or Activation',
            '3': 'Insurance Issue',
            '4': 'Warranty Issue',
            '5': 'General Issue', 
            '6': 'Enrollment Issues'});
    });
});
