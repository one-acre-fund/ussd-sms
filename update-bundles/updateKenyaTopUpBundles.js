service.vars.inputTableId = 'DT545a7c5683114b75';
var districts = require('./topUpKenyaDistricts');
var updateBundlesHelperFunctions= require('./updateBundlesHelperFunctions');


var districtBundles;
districts.forEach(function(district){
    console.log('***********District:'+ district+ 'started******************');
    districtBundles = updateBundlesHelperFunctions.fetchDistrictBundles(district);
    updateBundlesHelperFunctions.processBundles(districtBundles, district);
    console.log('#################################District: '+district+'finished#######################');
});