var getCurrentDate = require('../../shared/getCurrentDate');
var getShsPrice =  require('./getShsPrice');

module.exports = function getkeyCodeForRequest(client) {
    var NOCODE = null;
    var ACTIVATIONCODE = 'ACTIVATION';
    var UNLOCKCODE = 'UNLOCK';
    // the only way to distinguish initial registration with update is presense of state.vars.unit_to_update
    var serialTobeUpdated = JSON.parse(state.vars.unit_to_update); // {...,createdAt: unix.Date}
    var initialRegistrationTime = new Date(parseInt(serialTobeUpdated.createdAt));
    var registrationMonth = parseInt(initialRegistrationTime.getMonth()); // returns a month in which client initially registered their unit (started using it)
    var registrationYear = parseInt(initialRegistrationTime.getFullYear());
    var currentTime = getCurrentDate();
    var currentMonth = parseInt(currentTime.getMonth()) + 1;
    // calculate the credit cycle based on month (A: 8august - 1jan next yeat | B: 2feb - 7sept)
    // search the 
    var BalanceHistory = client.BalanceHistory;
    var positionInArray = 0; // holds the index of the registration season in the BalanceHistory array
    // var registrationHistory = {}; // contains the balance history for the season of the unit registration
    var expectedCreditCycle;
    BalanceHistory.forEach(function(entry, index) {
        if(registrationMonth >= 8) {
            expectedCreditCycle = registrationYear  + 1 + 'A';
        } else if(registrationMonth === 1) {
            expectedCreditCycle = registrationYear + 'A';
        } else {
            expectedCreditCycle = registrationYear + 'B';
        }
        if(entry.TotalCreditPerCycle[expectedCreditCycle]) {
            positionInArray = index;
            // registrationHistory = entry;
        }
    });
    var SHSPrice = getShsPrice(expectedCreditCycle);
    var allSeasons = client.BalanceHistory.slice(0, positionInArray + 1);
    // check if client has reached 4 seasons and is in need of an UNLOCK code {must have over paid all the remaining amount in the current season}

    // check if a client is eligible for an ACTIVATION code {must have paid 60% of the most recent season and that season must not be the last seasonB}

    if(allSeasons.length === 1) {
        // if we are still in the season in which the client registered in
        // var currentCreditCycle = allSeasons[0].TotalCreditPerCycle;
        // var creditCyclesNames = Object.keys(currentCreditCycle);
        // check if they registered in creditCycle B (means they definitely want the first activation code and they must have paid credit cylce B in full to get an activation code)
        if(expectedCreditCycle.split('B').length > 1) {
            // means the initial credit cycle is B
            var creditInB = parseInt(allSeasons[0].TotalCreditPerCycle[expectedCreditCycle]); // the total debt in credit cycle B
            if(allSeasons[0].TotalRepayment_IncludingOverpayments >= creditInB) {
                // paid in full
                if(allSeasons[0].TotalRepayment_IncludingOverpayments >= creditInB + SHSPrice) {
                    // paid in full with  enough overpayment to cover for UNLOCK CODE (THERE is a need to calculate for the required overpayment) its total since it is the second activation code
                    return UNLOCKCODE;
                } else {
                    // PAID in full  and added the overpayment for UNLOCK CODE
                    return ACTIVATIONCODE;
                }
            } else {
                // less no activation
                return NOCODE;
            }
        } else {
            // means initial crediti cycle is  A
            // its either the end of season A(code 2) or end of B(code 3)
            // check if the current month lies in the range of A
            var creditInA = parseInt(allSeasons[0].TotalCreditPerCycle[expectedCreditCycle]);
            if(currentMonth >= 12 || currentMonth <= 3) {
                // means client wants the second activation code (end of A)
                if(allSeasons[0].TotalRepayment_IncludingOverpayments >= (creditInA * 60 / 100)) {
                    // paid in full
                    if(allSeasons[0].TotalRepayment_IncludingOverpayments >= creditInA + 3 * SHSPrice/4) {
                        // paid in full with  enough overpayment to cover for UNLOCK CODE (THERE is a need to calculate for the required overpayment) its total since it is the second activation code
                        return UNLOCKCODE;
                    } else {
                        // PAID in full  and added the overpayment for UNLOCK CODE
                        return ACTIVATIONCODE;
                    }
                } else {
                    // less no activation
                    return NOCODE;
                }
            } else if(currentMonth >= 7 && currentMonth <= 10) {
                // client wants the third activation code (end of B)
                creditInB = parseInt(allSeasons[0].TotalCreditPerCycle[expectedCreditCycle.slice(0, 4) + 'B']); // the total debt in credit cycle B
                if(allSeasons[0].TotalRepayment_IncludingOverpayments >= creditInB) {
                    // paid in full
                    if(allSeasons[0].TotalRepayment_IncludingOverpayments >= allSeasons[0].TotalCredit + SHSPrice/2) {
                        // paid in full with  enough overpayment to cover for UNLOCK CODE (THERE is a need to calculate for te required overpayment) its total since it is the second activation code
                        return UNLOCKCODE;
                    } else {
                        // PAID in full  and added the overpayment for UNLOCK CODE
                        return ACTIVATIONCODE;
                    }
                } else {
                    // less no activation
                    return NOCODE;
                }
            }
        }
    } else if(allSeasons.length === 2){
        expectedCreditCycle = (parseInt(expectedCreditCycle.slice(0, 4)) + 1) + 'A';
        // means  client has alasready used theunit for a year (2 creedit cycles)
        creditInA = parseInt(allSeasons[0].TotalCreditPerCycle[expectedCreditCycle]);
        // var LastSeason = allSeasons[positionInArray - 1];
        // end of A
        if(currentMonth >= 12 || currentMonth <= 3) {
            // end of last season A
            // means client wants the second activation code (end of A)
            if(allSeasons[0].TotalRepayment_IncludingOverpayments >= (creditInA * 60 / 100)) {
                // paid in full
                if(allSeasons[0].TotalRepayment_IncludingOverpayments >= allSeasons[0].TotalCredit + SHSPrice/4) {
                    // paid in full with  enough overpayment to cover for UNLOCK CODE (THERE is a need to calculate for the required overpayment) its total since it is the second activation code
                    return UNLOCKCODE;
                } else {
                    // PAID  60+%
                    return ACTIVATIONCODE;
                }
            } else {
                // less no activation
                return NOCODE;
            }
        } else if (currentMonth >= 7 && currentMonth <= 10){
            // end of last season B
            // client wants the third activation code (end of B)
            if(allSeasons[0].TotalRepayment_IncludingOverpayments >= allSeasons[0].TotalCredit) {
                // paid in full AT THE END OF LAST SEASON B
                return UNLOCKCODE;
            } else {
                // less no activation
                return NOCODE;
            }
        }

    } else {
        // 3+ check if they completed the payment in second season (they have used the unit for more than 2 years hence index 1 has the last season) OR LESS seasons
        if(allSeasons[1].TotalRepayment_IncludingOverpayments >= allSeasons[1].TotalCredit) {
            // paid in full
            return UNLOCKCODE;
        } else {
            // PAID in full  and added the overpayment for UNLOCK CODE
            return NOCODE;
        }

    }
    
};
