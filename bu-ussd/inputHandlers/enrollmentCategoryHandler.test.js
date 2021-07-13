var enrollmentCategoryHandler = require('./enrollmentCategoryHandler');
var preEnrollmentHandler = require('./preEnrollmentHandler');
var groupCodeHandler = require('./groupCodeHandler');
describe('pre enrollment', () => {
    var handler;
    beforeEach(() => {
        handler = enrollmentCategoryHandler.getHandler('en_bu');
    });

    it('should prompt for the account number to be enrolled and set the sameGroup var to true if the GL chose to enroll in their group(1)',()=>{
        handler(1);
        expect(sayText).toHaveBeenCalledWith('Enter the account number of the farmer you want to order for');
        expect(state.vars.sameGroup).toEqual('true');
        expect(global.promptDigits).toHaveBeenCalledWith(preEnrollmentHandler.handlerName);

    });
    it('should prompt for the group coded and set the sameGroup var to false if the GL chose to enroll in other group(2)',()=>{
        handler(2);
        expect(sayText).toHaveBeenCalledWith('Enter group code of the client you want to order for');
        expect(state.vars.sameGroup).toEqual('false');
        expect(global.promptDigits).toHaveBeenCalledWith(groupCodeHandler.handlerName);

    });
    it('should reprompt for input if the entered value is not 1 or 2',()=>{
        handler(3);
        expect(sayText).toHaveBeenCalledWith('1) Enroll Farmers in my group\n2) Enroll Farmer in a different group');
        expect(global.promptDigits).toHaveBeenCalledWith(enrollmentCategoryHandler.handlerName);
    });
});