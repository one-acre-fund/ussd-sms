const {handlerName,getHandler} = require('./groupLeaderQuestionHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('group_leader_question_handler', () => {
    var groupLeaderQuestionHandler;
    var onGroupLeaderQuestion;
    beforeEach(() => {
        sayText.mockReset();
        onGroupLeaderQuestion = jest.fn();
        state.vars.reg_lang = 'en-ke';
        state.vars.country = 'ke';
        groupLeaderQuestionHandler = getHandler(onGroupLeaderQuestion);
    });
    it('should be a function', () => {
        expect(groupLeaderQuestionHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        groupLeaderQuestionHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should not call onGroupLeaderQuestion if input is not 1 or 2', () => {
        groupLeaderQuestionHandler('7');
        expect(onGroupLeaderQuestion).not.toHaveBeenCalled();
    });
    it('should set groupLeader state variable to true and call onGroupLeaderQuestion if input is 1', () => {
        groupLeaderQuestionHandler('1');
        expect(state.vars.groupLeader).toBeTruthy();
        expect(onGroupLeaderQuestion).toHaveBeenCalledWith('1');
    });
    it('should set groupLeader state variable to false and call onGroupLeaderQuesion if the input is 2', () => {
        groupLeaderQuestionHandler('2');
        expect(state.vars.groupLeader).toBeFalsy();
        expect(onGroupLeaderQuestion).toHaveBeenCalledWith('2');
    });
    it('should reprompt the user with the message asking if they want to be a group eader if the input is not 1 or 2', () => {
        groupLeaderQuestionHandler('4');
        expect(sayText).toHaveBeenCalledWith('Does the farmer want to be a Group Leader of a new group?\n1) Yes\n2) No');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });

});