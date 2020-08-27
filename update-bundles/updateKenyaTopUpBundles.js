var defaultEnvironment;
if(service.active){
    defaultEnvironment = 'prod';
}else{
    defaultEnvironment = 'dev';
}

var env;
if(service.vars.env === 'prod' || service.vars.env === 'dev'){
    env = service.vars.env;
}else{
    env = defaultEnvironment;
}

service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key']; 
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