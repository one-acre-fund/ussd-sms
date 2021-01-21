const topTipsMenuHandler2 = require('./topTipsMenuHandler2');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Top tips menu handler for top tips 5 to 8', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = undefined;
    });

    it('plays the fifth top tip when 1 is pressed', () => {
        topTipsMenuHandler2('1');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044349/99f03ca99ead/tip_5.mp3');
        expect(state.vars.played).toEqual('top-tip-5');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the sixth top tip when 2 is pressed', () => {
        topTipsMenuHandler2('2');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044378/51d196ecce0d/tip_6.mp3');
        expect(state.vars.played).toEqual('top-tip-6');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the seventh top tip when 3 is pressed', () => {
        topTipsMenuHandler2('3');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044410/cdd0ce1b1338/tip_7.mp3');
        expect(state.vars.played).toEqual('top-tip-7');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the eighth top tip when 4 is pressed', () => {
        topTipsMenuHandler2('4');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044445/bc09c974c27b/tip_8.mp3');
        expect(state.vars.played).toEqual('top-tip-8');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('repeats the current menu options when 0 is pressed', () => {
        topTipsMenuHandler2('0');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610995851/cb8e0f3b5564/top_tips_menu_2.mp3');
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu2');
    });

    it('returns to the main menu when * is pressed', () => {
        topTipsMenuHandler2('*');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3');
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        topTipsMenuHandler2('8');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610454402/41492056b35e/14.wav');
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu2');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        topTipsMenuHandler2('9');
        topTipsMenuHandler2('8');
        topTipsMenuHandler2('7');
        expect(state.vars.invalidInputAttempts).toEqual(3);
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        topTipsMenuHandler2('9');
        topTipsMenuHandler2('7');
        topTipsMenuHandler2('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK',() => {
        topTipsMenuHandler2('0');
        expect(notifyELK).toHaveBeenCalled();
    });
});