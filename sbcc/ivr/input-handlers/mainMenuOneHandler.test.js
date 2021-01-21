const mainMenuOneHandler = require('./mainMenuOneHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Main menu one handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = null;
    });

    it('plays the latest episode when 1 is pressed', () => {
        state.vars.latestEpisode = 'episode-1';
        mainMenuOneHandler('1');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611040271/8f39b3b04369/ep1_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-1');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610463660/eaab86509562/episode_menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('plays the latest top tip 2 is pressed', () => {
        state.vars.mainMenu = '1st-flow-full-menu';
        state.vars.latestTip = 'top-tip-1';
        mainMenuOneHandler('2');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044220/767f32f67a6f/tip_1.mp3'
        );
        expect(state.vars.played).toEqual('top-tip-1');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610987559/75337eebdd49/tip_menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('plays the previous episode when 3 is pressed', () => {
        state.vars.mainMenu = '1st-flow-full-menu';
        state.vars.previousEpisode = 'episode-2';
        mainMenuOneHandler('3');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611040432/38899f5a59d0/ep2.mp3'
        );
        expect(state.vars.played).toEqual('episode-2');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610463660/eaab86509562/episode_menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('plays the previous top tip when 4 is pressed', () => {
        state.vars.mainMenu = '1st-flow-full-menu';
        state.vars.previousTip = 'top-tip-1';
        mainMenuOneHandler('4');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044220/767f32f67a6f/tip_1.mp3'
        );
        expect(state.vars.played).toEqual('top-tip-1');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610987559/75337eebdd49/tip_menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('repeats the main menu when 0 is pressed', () => {
        state.vars.mainMenu = '1st-flow-full-menu';
        mainMenuOneHandler('0');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610983346/3e4d5fd3f204/1st_flow_main_menu_full.wav'
        );
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        mainMenuOneHandler('9');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610454402/41492056b35e/14.wav'
        );
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        mainMenuOneHandler('8');
        mainMenuOneHandler('7');
        mainMenuOneHandler('6');
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        mainMenuOneHandler('8');
        mainMenuOneHandler('7');
        mainMenuOneHandler('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK', () => {
        mainMenuOneHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
});
