const selectedTipAndEpHandler1 = require('./selectedTipAndEpHandler1');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Selected tip and episode handler for IVR first flow', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = undefined;
    });

    it('repeats the played episode when O is pressed', () => {
        state.vars.played = 'episode-1';
        selectedTipAndEpHandler1('0');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610460128/48164c80b758/EP1-ENG1.mp3');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610463660/eaab86509562/episode_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('repeats the played top tip when 0 is pressed', () => {
        state.vars.played = 'top-tip-1';
        selectedTipAndEpHandler1('0');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044220/767f32f67a6f/tip_1.mp3');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610987559/75337eebdd49/tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('returns to the correct main menu when * is pressed', () => {
        state.vars.mainMenu = '1st-flow-full-menu',
        state.vars.mainMenuHandler = '1stFlowMenuChoice';
        selectedTipAndEpHandler1('*');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610983346/3e4d5fd3f204/1st_flow_main_menu_full.wav');
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        selectedTipAndEpHandler1('9');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611058272/657148b4fe41/invalid_option_2.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        selectedTipAndEpHandler1('9');
        selectedTipAndEpHandler1('8');
        selectedTipAndEpHandler1('7');
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        selectedTipAndEpHandler1('9');
        selectedTipAndEpHandler1('7');
        selectedTipAndEpHandler1('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK',() => {
        selectedTipAndEpHandler1('0');
        expect(notifyELK).toHaveBeenCalled();
    });
});