module.exports = function nextScreensHandler(input) {
    var screens = JSON.parse(state.vars.screens);
    var current_screen = state.vars.current_screen;

    if(input == 77 && screens[current_screen + 1]) {
        state.vars.current_screen = current_screen + 1;
        sayText(screens[state.vars.current_screen]);
        if(screens[state.vars.current_screen + 1]) {
            promptDigits('next_farmers_list', {
                maxDigits: 1,
                timeout: 10,
                submitOnHash: false
            });
        }
    }
};
