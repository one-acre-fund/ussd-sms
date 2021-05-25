describe('SBCC IVR main', () => {
    beforeAll(() => {
        global.contact = { vars: { sbccLang: 'en' } };
    });

    beforeEach(() => {
        jest.resetModules();
        call.vars = {};
    });

    it('should register input handlers', () => {
        require('./ivrMain');
        expect(addInputHandler).toHaveBeenCalledTimes(8);
    });

    it('should register call complete event handler', () => {
        require('./ivrMain');
        expect(addEventListener).toHaveBeenCalledWith('call_complete', expect.any(Function));
    });

    it('plays the menu with only latest episode option if only one episode has been released', () => {
        require('./ivrMain');
        state.vars.currentDate = '02/08/2021';
        global.main();
        expect(state.vars.latestEpisode).toEqual('episode-1');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610094056/f77fd04cefd7/16.wav');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610453824/dd57009af044/main_menu_with_only_latest_ep.wav');
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('plays the menu with only latest and previous episodes option if only two episodes have been released', () => {
        require('./ivrMain');
        state.vars.currentDate = '02/11/2021';
        global.main();
        expect(state.vars.latestEpisode).toEqual('episode-2');
        expect(state.vars.previousEpisode).toEqual('episode-1');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610094056/f77fd04cefd7/16.wav');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610983572/fd201f6819e8/main_menu_with_latest_and_previous_ep_only.mp3');
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('plays the menu that includes the latest top tip option if only one top tip has been released', () => {
        require('./ivrMain');
        state.vars.currentDate = '02/18/2021';
        global.main();
        expect(state.vars.latestTip).toEqual('top-tip-1');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610094056/f77fd04cefd7/16.wav');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610983772/03b231a383a0/main_menu_with_only_eps_and_latest_tip.mp3');
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('plays the full menu for the 1st IVR flow if at least 2 episodes and 2 top tips have been released', () => {
        require('./ivrMain');
        state.vars.currentDate = '03/21/2021';
        global.main();
        expect(state.vars.latestEpisode).toEqual('episode-5');
        expect(state.vars.previousEpisode).toEqual('episode-4');
        expect(state.vars.latestTip).toEqual('top-tip-2');
        expect(state.vars.previousTip).toEqual('top-tip-1');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610094056/f77fd04cefd7/16.wav');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610983346/3e4d5fd3f204/1st_flow_main_menu_full.wav');
        expect(promptKey).toHaveBeenCalledWith('1stFlowMenuChoice');
    });

    it('plays the full menu for the 2nd IVR flow if all episodes and top tips have been released', () => {
        require('./ivrMain');
        state.vars.currentDate = '06/16/2021';
        global.main();
        expect(state.vars.latestEpisode).toEqual('episode-12');
        expect(state.vars.latestTip).toEqual('top-tip-8');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610094056/f77fd04cefd7/16.wav');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3');
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('throws error if no episode has been released', () => {
        require('./ivrMain');
        state.vars.currentDate = '01/03/2021';
        var today = new Date(state.vars.currentDate);
        expect(() => global.main()).toThrowError('No episode or top tip has been released for the current date - ' + today.toDateString());
    });

    it('sets time elapsed between when ussd and ivr flows', () => {
        require('./ivrMain');
        state.vars.currentDate = '06/16/2021';
        contact.vars.sbcc_ussd_end_time = new Date(1621754230000).toString();
        global.main();
        expect(call.vars.time_answered).not.toBeNull();
        expect(call.vars.time_from_ussd_to_ivr).not.toBeNull();
    });
});
