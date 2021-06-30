describe('Log SMS error', () => {
    let mockService, mockCursor, mockMessage;
    beforeAll(()=>{
        project.vars.logErrorServiceId = 'fakeID';
        mockService = {
            invoke: jest.fn()
        };
        mockCursor = {
            hasNext: jest.fn(),
            next: jest.fn(),
            count: jest.fn(),
            limit: jest.fn()
        };
        mockMessage = {
            save: jest.fn(),
            id: 1234,
            stared: false
        };
    });
    beforeEach(() => {
        project.queryMessages.mockReturnValue(mockCursor);
        project.initServiceById.mockReturnValue(mockService);
    });

    it('should call the log service if there is some failure message',()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockMessage);
        require('./queryMessageFailure');
        expect(mockService.invoke).toHaveBeenCalledWith(expect.objectContaining({
            context: 'message', 
            message_id: 1234
        }));
    });

    it('should not call the log service if there is no failure message',()=>{
        project.queryMessages.mockReturnValueOnce(mockCursor);
        require('./queryMessageFailure');
        expect(mockService.invoke).not.toHaveBeenCalled();
    });
    
});