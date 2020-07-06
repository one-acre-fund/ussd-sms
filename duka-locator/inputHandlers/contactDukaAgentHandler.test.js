const contactDukaAgentHandler = require('./contactDukaAgentHandler');

describe('Contact duka agent input handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should contact the duka agent', () => {
        contact.phone_number = '0777664839';
        state.vars.duka_options = JSON.stringify({reach_out_to_agent: 1, exit_menu: 2});
        state.vars.selected_duka = JSON.stringify({duka_supervisor_pn: '0767443653', duka_supervisor_name: 'Claude'});
        contactDukaAgentHandler('1');
        expect(global.project.sendMulti).toHaveBeenCalledWith({
            'message_type': 'text', 'messages': [{
                'content': 'Claude is your One Acre Fund contact person. Their number is 0767443653', 'to_number': '0777664839'}, 
            {'content': 'There is a potential client with phonenumber 0777664839. Please call them back to follow up. Thanks', 'to_number': '0767443653'}]});
    });

    it('should exit the menu on choice', () => {
        contact.phone_number = '0777664839';
        state.vars.duka_options = JSON.stringify({reach_out_to_agent: 1, exit_menu: 2});
        state.vars.selected_duka = JSON.stringify({duka_supervisor_pn: '0767443653', duka_supervisor_name: 'Claude'});
        contactDukaAgentHandler('2');
        expect(stopRules).toHaveBeenCalledWith();
    });
});
