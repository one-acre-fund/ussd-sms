const {getHandler} = require('./groupCodeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
const { handlerName } = require('./groupCodeHandler');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('groupCodeHandler', () => {
    let onGroupCodeValidated;
    var groupCodeHandler;
    beforeEach(() => {
        onGroupCodeValidated = jest.fn();
        groupCodeHandler = getHandler(onGroupCodeValidated);
    });
    it('should return a function', () => {
        expect(getHandler(onGroupCodeValidated)).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        groupCodeHandler('0164602302345');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onGroupCodeValidated with a correct group ID, site ID and district ID if the ID entered by the user has both siteId and groupId positive',()=>{
        groupCodeHandler('0164602302345');
        var groupInfo = {'districtId': 1646, 'siteId': 23 ,'groupId': 2345};
        expect(onGroupCodeValidated).toHaveBeenCalledWith(groupInfo);
    });
    it('should call onGroupCodeValidated with a correct group ID, site ID and district ID if the ID entered by the user has both siteId and groupId positive without the leading zero',()=>{
        groupCodeHandler('164602302345');
        var groupInfo = {'districtId': 1646, 'siteId': 23 ,'groupId': 2345};
        expect(onGroupCodeValidated).toHaveBeenCalledWith(groupInfo);
    });
    it('should call onGroupCodeValidated with a correct group ID, site ID and district ID if the ID entered by the user has a negative siteId and a positive groupId',()=>{
        groupCodeHandler('01646*02302345');
        var groupInfo = {'districtId': 1646, 'siteId': -23 ,'groupId': 2345};
        expect(onGroupCodeValidated).toHaveBeenCalledWith(groupInfo);
    });
    it('should call onGroupCodeValidated with a correct group ID, site ID and district ID if the ID entered by the user has a positive siteId and a negative groupId',()=>{
        groupCodeHandler('01646023*02345');
        var groupInfo = {'districtId': 1646, 'siteId': 23 ,'groupId': -2345};
        expect(onGroupCodeValidated).toHaveBeenCalledWith(groupInfo);
    });
    it('should call onGroupCodeValidated with a correct group ID, site ID and district ID if the ID entered by the user has a negative siteId and a negative groupId',()=>{
        groupCodeHandler('01646*023*02345');
        var groupInfo = {'districtId': 1646, 'siteId': -23 ,'groupId': -2345};
        expect(onGroupCodeValidated).toHaveBeenCalledWith(groupInfo);
    });
    it('should call not onGroupCodeValidated with a incorrect group code, it should prompt for reentry instead',()=>{
        groupCodeHandler('002345');
        expect(onGroupCodeValidated).not.toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith('Enter GL code');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
});