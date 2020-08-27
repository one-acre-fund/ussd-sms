
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
var districtBundlesEndpoint = '/Api/DistrictBundles/Get/?districtId=';


function fetchDistrictBundles(districtId) {
    var fullUrl = service.vars.server_name + districtBundlesEndpoint + districtId;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'GET';

    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            console.log('***************SUCCESS*******************');
            // console.log("****response bundles****"+data.bundles);
            // console.log("****response bundleInputs****"+data.bundleInputs);

            return data;
        }
        else {
            var logResponse = require('../logger/data-table/request-logger');
            logResponse(fullUrl,response);
            console.log('####Failed to fetch district bundles' + JSON.stringify(response));
        }
    } catch (error) {
        console.log('Error: ' + error);
    }
}



function processBundles(districtBundles, districtId) {
    var processedBundles = [];
    districtBundles.bundles.forEach(function (bundle) {
        var bundleInput;
        districtBundles.bundleInputs.forEach(function (bi) {
            if (bi.BundleId === bundle.BundleId) {
                bundleInput = bi;
            }
        });
        if (bundleInput) {
            var processedBundle = {
                bundle_name: bundle.BundleName,
                input_name: bundleInput.InputName,
                en: bundle.BundleName,
                sw: bundle.BundleName,
                bundleType: bundle.BundleTypeId,
                increment: bundle.BundleQuantityIncrement,
                acceptableQuantityList: bundle.AcceptableQuantityList,
                max: bundle.UpperBoundQuantity,
                min: '',
                price: bundleInput.CostAdjustment_PerBundle,
                price_per_bundle: bundle.BundleCost_PerBundle,
                fixed_price: bundle.BundleCost_Fixed,
                unit: bundleInput.UnitTypeId,
                bundleInputId: bundleInput.BundleInputId,
                bundleId: bundleInput.BundleId,
            };
            processedBundles.push(processedBundle);
        } else {
            console.log('Empty bundle: ' + bundle.BundleName);
        }
    });
    addProcessedBundlesToDistrict(processedBundles, districtId);

}




function addProcessedBundlesToDistrict(processedBundles, districtId) {
    var table = project.initDataTableById(service.vars.inputTableId);
    processedBundles.forEach(function (pb) {
        var cursor = table.queryRows({ 'vars': { 'bundleInputId': pb.bundleInputId } });

        if (cursor.hasNext()) {
            var row = cursor.next();
            row.vars = {
                'en': pb.en,
                'sw': pb.sw,
                'increment': pb.increment,
                'input_name': pb.input_name,
                'bundle_name': pb.bundle_name,
                'bundleType': pb.BundleTypeId,
                'acceptableQuantityList': pb.acceptableQuantityList,
                'max': pb.max,
                'min': pb.min,
                'price': pb.price,
                'price_per_bundle': pb.price_per_bundle,
                'fixed_price': pb.fixed_price,
                'unit': pb.unit,
                'bundleInputId': pb.bundleInputId,
                'bundleId': pb.bundleId
            };
            row.vars['d' + districtId] = 1;
            row.save();
        }
        else {
            var option_numbers = table.countRowsByValue('option_number');
            var nextOptionNumber = Object.keys(option_numbers).length + 1;
            row = table.createRow({
                'vars': {
                    'en': pb.en,
                    'increment': pb.increment,
                    'input_name': pb.input_name,
                    'bundle_name': pb.bundle_name,
                    'sw': pb.sw,
                    'max': pb.max,
                    'min': pb.min,
                    'bundleType': pb.BundleTypeId,
                    'acceptableQuantityList': pb.acceptableQuantityList,
                    'price': pb.price,
                    'option_number': nextOptionNumber,
                    'price_per_bundle': pb.price_per_bundle,
                    'fixed_price': pb.fixed_price,
                    'unit': pb.unit,
                    'bundleInputId': pb.bundleInputId,
                    'bundleId': pb.bundleId,
                }
            });
            row.vars['d' + districtId] = 1;
            row.save();
        }
    });

}

module.exports = {
    processBundles: processBundles,
    fetchDistrictBundles: fetchDistrictBundles

};