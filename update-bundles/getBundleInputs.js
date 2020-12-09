var service ={vars: {

}};
var fs = require('fs');
const axios = require('axios').default;
var districtBundlesEndpoint = '/Api/DistrictBundles/Get/?districtId=';
service.vars.server_name = 'https://sms.operations.oneacrefund.org';
service.vars.roster_api_key = 'Token 4FD82238-386B-49CA-A0F5-94B618544061';
var districts = require('./KenyaAllDistricts');
var bundles=[];
var allBundles = [];
function fetchDistrictBundles(districtId) {
    var dataRes;
    var fullUrl = service.vars.server_name + districtBundlesEndpoint + districtId;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'GET';
    const options = {
        headers: {'Authorization': 'Token ' + service.vars.roster_api_key}
      };
    try { 
         axios.get(fullUrl,options)
  .then((response) => {
    dataRes = response.data;
     response.data;
     processBundles(dataRes,districtId);
    return response.data;
    
  });

    }catch (error) {
        console.log('Error: ' + error);}
 
}



function addProcessedBundlesToDistrict(processedBundles, districtId) {
    
    processedBundles.forEach(function (pb) {
        var bundleInputt;
            bundleInputt = allBundles.filter(function (row) {
                return row.bundleInputId == pb.bundleInputId;
            });
        if(bundleInputt.length > 0) {
            
            var index = allBundles.indexOf(bundleInputt[0]);
            console.log(index);
            var row = bundleInputt[0];
            row['d' + districtId] = 1;
            allBundles[index] = row;
        }
        else {
            var option_numbers = allBundles.length;
            var nextOptionNumber = option_numbers+ 1;
            row = {
                    'en': pb.en,
                    'increment': pb.increment,
                    'input_name': pb.input_name,
                    'bundle_name': pb.bundle_name,
                    'sw': pb.sw,
                    'max': pb.max,
                    'min': pb.min,
                    'bundleType': pb.bundleType,
                    'acceptableQuantityList': pb.acceptableQuantityList,
                    'price': pb.price,
                    'option_number': nextOptionNumber,
                    'price_per_bundle': pb.price_per_bundle,
                    'fixed_price': pb.fixed_price,
                    'unit': pb.unit,
                    'bundleInputId': pb.bundleInputId,
                    'bundleId': pb.bundleId,
                }
            row['d' + districtId] = 1;
            allBundles[option_numbers] = row;
        }
    });

    fs.writeFile ("allBundles.js", JSON.stringify(allBundles), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );

}

function processBundles(districtBundles, districtId) {
    var processedBundles = [];
    districtBundles.bundles.forEach(function (bundle) {
        
        var bundleInput = [];
        bundleInput = districtBundles.bundleInputs.filter(function(bi){
            return bi.BundleId === bundle.BundleId;
        });
        
        bundleInput.forEach(function (bi){
            if (bi) {
                var processedBundle = {
                    bundle_name: bundle.BundleName,
                    input_name: bi.InputName,
                    en: bundle.BundleName,
                    sw: bundle.BundleName,
                    bundleType: bundle.BundleTypeId,
                    increment: bundle.BundleQuantityIncrement,
                    acceptableQuantityList: bundle.AcceptableQuantityList,
                    max: bundle.UpperBoundQuantity,
                    min: '',
                    price: bi.CostAdjustment_PerBundle,
                    price_per_bundle: bundle.BundleCost_PerBundle,
                    fixed_price: bundle.BundleCost_Fixed,
                    unit: bi.UnitTypeId,
                    bundleInputId: bi.BundleInputId,
                    bundleId: bi.BundleId,
                };
                processedBundles.push(processedBundle);
            } else {
                console.log('Empty bundle: ' + bundle.BundleName);
            }

        });
        
    });
    addProcessedBundlesToDistrict(processedBundles, districtId);

}

districts.forEach(function(district){
    var bundles = fetchDistrictBundles(district);
    console.log(bundles);

});