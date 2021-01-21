const topTipsMenuHandler1 = require('./topTipsMenuHandler1');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Top tips menu handler for top tips 1 to 4', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = undefined;
    });

    it('plays the first top tip when 1 is pressed', () => {
        topTipsMenuHandler1('1');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044220/767f32f67a6f/tip_1.mp3');
        expect(state.vars.played).toEqual('top-tip-1');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the second top tip when 2 is pressed', () => {
        topTipsMenuHandler1('2');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044259/65517afa454f/tip_2.mp3');
        expect(state.vars.played).toEqual('top-tip-2');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the third top tip when 3 is pressed', () => {
        topTipsMenuHandler1('3');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044287/321b6e66e42a/tip_3.mp3');
        expect(state.vars.played).toEqual('top-tip-3');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the fourth top tip when 4 is pressed', () => {
        topTipsMenuHandler1('4');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044316/f8aa29b07cfc/tip_4.mp3');
        expect(state.vars.played).toEqual('top-tip-4');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the menu for more tips when 5 is pressed', () => {
        topTipsMenuHandler1('5');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610995851/cb8e0f3b5564/top_tips_menu_2.mp3');
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu2');
    });

    it('repeats the current menu options when 0 is pressed', () => {
        topTipsMenuHandler1('0');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610994665/3ae228b3c831/top_tips_menu_1.mp3');
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu1');
    });

    it('returns to the main menu when * is pressed', () => {
        topTipsMenuHandler1('*');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3');
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        topTipsMenuHandler1('8');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610454402/41492056b35e/14.wav');
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu1');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        topTipsMenuHandler1('9');
        topTipsMenuHandler1('8');
        topTipsMenuHandler1('7');
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        topTipsMenuHandler1('9');
        topTipsMenuHandler1('7');
        topTipsMenuHandler1('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK',() => {
        topTipsMenuHandler1('0');
        expect(notifyELK).toHaveBeenCalled();
    });
});