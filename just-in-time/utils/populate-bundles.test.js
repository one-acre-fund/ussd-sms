
var populateBundle = require('./populate-bundles');

var lang  = 'en-ke';
var maxChars = 140;
var bundleInputs = [{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'},{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'},{'bundleId': '-1009','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'},{'bundleId': '-2009','bundleInputId': '-18909','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'}];
var fewBundleInputs = [{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'},{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'}];
describe('populateBundle test',()=>{

    it('should be a function',()=>{
        expect(populateBundle).toBeInstanceOf(Function);
    });
    it('should populate the menu with the bundles given',()=>{
        var menu = populateBundle(lang, maxChars,fewBundleInputs);
        var expectedMenu = 'Select a product\n1) Second possible name bundle 2251\n2) third possible name bundle 6251\n';
        expect(menu).toEqual(expectedMenu);

    });
    it('should include next and previous options if the menu is beyond one page',()=>{
        var menu = populateBundle(lang, maxChars,bundleInputs);
        var expectedMenu = {'0': 'Select a product\n1) Second possible name bundle 2251\n2) third possible name bundle 6251\n3) fourth possible name bundle 5251\n77)Next page', '1': '44)Previous page\n4)Second possible name bundle 2251\n'};
        expect(menu).toEqual(expectedMenu);
    });

    it('should populate the menu with vaieties given',()=>{
        var menu = populateBundle(lang, maxChars,fewBundleInputs,true);
        var expectedMenu = 'Select seed variety\n1) second input\n2) third input\n';
        expect(menu).toEqual(expectedMenu);
    });

});
