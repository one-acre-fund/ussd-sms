const phoneNumberHandler = require('./phoneNumberHandler');

describe('phone number handler', () => {
    beforeAll(() => {
        state.vars.trainingsHandler = 'trainingsHandler';
    });

    it('should prompt for trainings when user provides a valid phone', () => {

        const tableMock = {queryRows: jest.fn()};
        const rowMock = {hasNext: jest.fn(), next: jest.fn()};
        
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValueOnce(rowMock);

        const trainingMenuText = jest.fn();

        rowMock.hasNext.mockReturnValueOnce(true);
        rowMock.next.mockReturnValueOnce({vars: {phone_number: '2540716263596'}});
        var handler = phoneNumberHandler.getHandler(trainingMenuText, 'en');
        handler('716263596');
        expect(trainingMenuText).toHaveBeenCalled();
        expect(promptDigits).toHaveBeenCalledWith('trainingsHandler');
    });
    it('should reprompt for main menu when user provides an invalid phone', () => {

        const tableMock = {queryRows: jest.fn()};
        const rowMock = {hasNext: jest.fn(), next: jest.fn()};

        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(rowMock);
        const trainingMenuText = jest.fn();
        rowMock.hasNext.mockReturnValue(false);
        var handler = phoneNumberHandler.getHandler(trainingMenuText, 'en');
        handler('716263596');
        expect(sayText).toHaveBeenCalledWith('enter your pin number');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberHandler.handlerName);
    });
});
