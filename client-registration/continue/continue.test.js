const {getHandler} = require('./continue');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var {client}  = require('../../client-enrollment/test-client-data'); 

jest.mock('../../notifications/elk-notification/elkNotification');
describe('continueHandler', () => {
    let onContinueToEnroll;
    var continueHandler;
    state.vars.client_json = JSON.stringify(client);
    var wareHouseRow = {vars: {'warehouse': 'name'}};
    var mockTable = { createRow: jest.fn(), queryRows: jest.fn()};
    var mockCursor = {next: jest.fn(), hasNext: jest.fn()};
    beforeAll(()=>{
        project.initDataTableById = jest.fn().mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
    });
    beforeEach(() => {
        onContinueToEnroll = jest.fn();
        continueHandler = getHandler(onContinueToEnroll);
        mockCursor.hasNext.mockReturnValue(false);
    });
    it('should return a function', () => {
        expect(getHandler(onContinueToEnroll)).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        continueHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onContinueToEnroll if the user press 1', () => {
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(false);
        mockCursor.next.mockReturnValueOnce(wareHouseRow);
        continueHandler(1);
        expect(onContinueToEnroll).toHaveBeenCalled();
    });
    it('should set the state.vars.varietyWarehouse if available onContinueToEnroll if the user press 1', () => {
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(wareHouseRow).mockReturnValueOnce(wareHouseRow);
        continueHandler(1);
        expect(state.vars.varietyWarehouse).toBe(wareHouseRow.vars.warehouse);
    });
    it('should not call onContinueToEnroll if the user doesn\'t press 1', () => {
        continueHandler(2);
        expect(onContinueToEnroll).not.toBeCalled();
    });
});