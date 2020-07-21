var populate_menu = require('./populate-menu');
module.exports = function(input) {
    var splash = service.vars.main_menu_table_name ;
    state.vars.splash = splash;
    var menu = populate_menu(splash, project.vars.lang);
    if (typeof (menu) == 'string') {
        state.vars.current_menu_str = menu;
        global.sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        global.promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': project.vars.max_digits, 'timeout': project.vars.timeout_length });
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        state.vars.current_menu_str = menu[state.vars.input_menu_loc];
        global.sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
        global.promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': project.vars.max_digits, 'timeout': project.vars.timeout_length });
    }
    
};