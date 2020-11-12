var validateGroup = require('./validateGroup');
describe('validate_group', () => {
    const validGroup = '2964602300618';
    const invalidGroup = '111111111111';
    it('should be  function',()=>{
        expect(validateGroup).toBeInstanceOf(Function);
    });
    it('should return true if groupcode is found', ()=>{
        var isValid = validateGroup(validGroup);
        expect(isValid).toBeTruthy();
    });
    it('should return false if groupcode is not found', ()=>{
        var isValid = validateGroup(invalidGroup);
        expect(isValid).toBeFalsy();
    });

});