/*
module for retrieving product option rows
*/

var districtBundles = require('../dat/district-bundles');
var admin_alert = require('./admin-alert');

module.exports = function(product_name, product_table){
    console.log(product_name + ' : ' + product_table);
    var selections = districtBundles.filter(function (row) {
        return row.bundle_name == product_name;
    });
    if(selections.length>0){
        var product_row = selections[0];
        if(selections.length>1){
            var bundleIds = {};
            selections.forEach(function (row) {
                bundleIds[row.bundleId] = '';
            });
            if(Object.keys(bundleIds).length < selections.length){
                admin_alert('Duplicate product in District bundles : ' + product_name);
            }
        }
        if(product_row.bundle_name == null){
            admin_alert('Null product in District bundles : ' );
            throw 'ERROR: null product';
        }
        return {'input_name': product_row.input_name,
            'bundle_name': product_row.bundle_name,
            'increment': product_row.increment,
            'price': product_row.price,
            'max': product_row.max,
            'min': product_row.min,
            'unit': product_row.unit,
            'en': product_row.en,
            'ki': product_row.ki,
            'bundleId': product_row.bundleId,
            'bundleInputId': product_row.bundleInputId,
            'acceptableQuantityList': product_row.acceptableQuantityList
        };
    }
    else{
        throw 'ERROR: missing product in district bundles : ' + product_name;
    }
};
