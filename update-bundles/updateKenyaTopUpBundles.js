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

if(service.vars.env == 'prod'){
    service.vars.inputTableId = 'DT891c89e9a82b6841';

}
else{
    service.vars.inputTableId = 'DT545a7c5683114b75';

}


var districts = require('./topUpKenyaDistricts');
var updateBundlesHelperFunctions= require('./updateBundlesHelperFunctions');

global.main= function(){
    state.vars.counter = 0;
    sayText('press any key to start');
    promptDigits('update_bundles', {
        'submitOnHash': false,
        'maxDigits': 1,
        'timeout': 180
    });

};
var districtBundles;
var inputHanlder = function(input){
    if(state.vars.counter < districts.length){
        var currentDistricts = districts.slice(state.vars.counter, (state.vars.counter)+1);
        currentDistricts.forEach(function(district){
            console.log('***********District:'+ district+ 'started******************');
            districtBundles = updateBundlesHelperFunctions.fetchDistrictBundles(district);
            updateBundlesHelperFunctions.processBundles(districtBundles, district);
            console.log('#################################District: '+district+'finished#######################');
        });
        console.log(state.vars.counter +' '+ input);
        state.vars.counter = (state.vars.counter) + 1;
        console.log(state.vars.counter);
        sayText('press any key to continue');
        promptDigits('update_bundles_two', {
            'submitOnHash': false,
            'maxDigits': 1,
            'timeout': 180
        });
    }
    else{
        sayText('Updating finished !');
    }
};
var inputHanlderTwo = function(input){
    if(state.vars.counter < districts.length){
        var currentDistricts = districts.slice(state.vars.counter, (state.vars.counter)+1);
        currentDistricts.forEach(function(district){
            console.log('***********District:'+ district+ 'started******************');
            districtBundles = updateBundlesHelperFunctions.fetchDistrictBundles(district);
            updateBundlesHelperFunctions.processBundles(districtBundles, district);
            console.log('#################################District: '+district+'finished#######################');
        });
        console.log(state.vars.counter + ' '+ input);
        state.vars.counter = (state.vars.counter) + 1;
        console.log(state.vars.counter);
        sayText('press any key to continue');
        promptDigits('update_bundles', {
            'submitOnHash': false,
            'maxDigits': 1,
            'timeout': 180
        });
    }
    else{
        sayText('Updating finished !');
    }
};
addInputHandler('update_bundles', inputHanlder);
addInputHandler('update_bundles_two', inputHanlderTwo);
// var districtBundles;
// districts.forEach(function(district){
//     console.log('***********District:'+ district+ 'started******************');
//     districtBundles = updateBundlesHelperFunctions.fetchDistrictBundles(district);
//     updateBundlesHelperFunctions.processBundles(districtBundles, district);
//     console.log('#################################District: '+district+'finished#######################');
// });