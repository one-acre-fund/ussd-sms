var translations = {
    'payment_receipt_ug': {
        en: 'Hello $firstName, You have paid OAF $lastTransaction. Your Loan Balance is now $balance. For questions, call 0800388889. Thank You!'
    }
};
function getTranslations(label, options, lang) {
    var message = translations[label][lang];
  
    Object.keys(options).forEach(function (key) {
        var re = new RegExp('\\$' + key, 'g');    
        message = message.replace(re, options[key]);
    });
    return message;
}

module.exports = getTranslations;
