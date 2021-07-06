
// function to return district/sector chicken cap
/**
 * Takes in district and sector names and returns chicken cap details 
 * @param {String} districtName name of client's district
 * @param {String} sectorName name of the client's sector
 * @returns chicken cap, district name, sector name, delivery window (EN&KI)
 */
module.exports = function getChickenCap(districtName, sectorName) {
    /*table that contains the cap and delivery wondow data for all districts and sectors
    it needs updates whenever there is a change in the cap from the field teams*/
    var capTable = project.getOrCreateDataTable('chicken district_sector cap'); 
    var capCursor = capTable.queryRows({
        vars: {
            district_name: districtName,
            sector_name: sectorName
        }
    });
    var capInformation = null;
    if(capCursor.hasNext()) {
        var capRow = capCursor.next();
        capInformation = capRow.vars;
    }
    return capInformation;
};
