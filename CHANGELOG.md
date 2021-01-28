# CHANGELOG
All notable changes to this project will be documented in this file. 

## New Version


### Added
* [MOB-161](https://oneacrefund.atlassian.net/browse/MOB-161) Update Market Access Info
* [MOB-53](https://oneacrefund.atlassian.net/browse/MOB-53) Develop an IVR to collect a nutrition survey from clients/Farmers and their household members

### Changed
* [SER-409](https://oneacrefund.atlassian.net/browse/SER-409) January Chicken confirmation service setup

### Added
* [MOB-123](https://oneacrefund.atlassian.net/browse/MOB-123) As a farmer receiving the repayment trial call. I need to be able to select an option to make a repayment and then make that repayment while on the call.

### Changed
* [MOB-158](https://oneacrefund.atlassian.net/browse/MOB-158) Updating the way of calculating the % repaid from Total credit to A cycle credit for Chicken confirmation Clients

### v1.6.6
### Changed
* [SER-407](https://oneacrefund.atlassian.net/browse/SER-407) some clients are unable to top-up or enroll through JiT enrollment - changed a message being displayed

### v1.6.5
### Fixed
* [MOB-159](https://oneacrefund.atlassian.net/browse/MOB-159) KE- GLs unable to access the Group Repayment Summary

### v1.6.4
### Changed
* [MOB-157](https://oneacrefund.atlassian.net/browse/MOB-157) Remove the menu redirection to products from RW enrollment

### v1.6.3
### Added
* [MOB-150](https://oneacrefund.atlassian.net/browse/MOB-150) Make JiT Top-Up and Enrollment invisible on Client Menu

### v1.6.2
### Fixed
* [MOB-156](https://oneacrefund.atlassian.net/browse/MOB-156) Update the KE registration to check the warehouse stock

## v1.6.1
### Fixed
* [MOB-146](https://oneacrefund.atlassian.net/browse/MOB-146) maize_recommendation was unable to automatically process an incoming SMS
## v1.6.0
### Fixed
* [MOB-109](https://oneacrefund.atlassian.net/browse/MOB-109) Fix Healthy path calculation
## v1.5.1
* [MOB-142](https://oneacrefund.atlassian.net/browse/MOB-142) USSD Sessions are failing with a Recipient number empty error
    * change the maximum cap for the number of chickens to 15
### Added
* [MOB-132](https://oneacrefund.atlassian.net/browse/MOB-132) Changed the chicken confirmation cap to check per sector
## v1.5.0
### Changed
* [SER-370](https://oneacrefund.atlassian.net/browse/SER-370) Verify Groups on Roster instead of using telerivet data tables
* [MOB-128](https://oneacrefund.atlassian.net/browse/MOB-128) Repayment Services UAT fixes
### Depricated
* [MOB-83](https://oneacrefund.atlassian.net/browse/MOB-83) Remove "Report Seed Quality Issue" from USSD main Menu (KE)
### Added
* [MOB-125](https://oneacrefund.atlassian.net/browse/MOB-125) Add a request to the logger

## v1.4.0
### Added
* [SER-343](https://oneacrefund.atlassian.net/browse/SER-343) Enable prepayment calculator. Add 10% of prepayment amount
* [MOB-15](https://oneacrefund.atlassian.net/browse/MOB-15) Add USSD Field Officer Details to main menu
* [MOB-41](https://oneacrefund.atlassian.net/browse/MOB-41) Add auto cleanup for CallBackUSSD datatable
### Changed
* [SER-364](https://oneacrefund.atlassian.net/browse/SER-364) Check whether a product is available in the closest warehouse based on the client's district
* [MOB-70](https://oneacrefund.atlassian.net/browse/MOB-70) JiT Kenya: As a GL, when I enter an account number for a client not in my group, I need a pop with a descriptive error message
* [SER-368](https://oneacrefund.atlassian.net/browse/SER-368) As a client, I need to be limited to ordering three products max
* [SER-367](https://oneacrefund.atlassian.net/browse/SER-367) As a client, I need to be able to place multiple orders across multiple USSD cycles

## v1.3.0
### Fixed 
* [SER-334](https://oneacrefund.atlassian.net/browse/SER-334) Kenya Enrollment/Just In time fixes(part 2)
    * updated maize bundle logic
    * updated eligibility to topUp/enroll check
    * added a back navigation
    * Add a menu to display the bundles after registration
    * Rename the menu options
    * Remove a product from the list once the client ordered it
    * Update the bundles
    * Change the prepayment calculations
    * Update the confirmation message
### Added
* [SER-353](https://oneacrefund.atlassian.net/browse/SER-353) Add option to change language to English when testing for USSD
## v1.2.2
### Fixed
* [THD-3792](https://oneacrefund.atlassian.net/browse/THD-3792) New sites can't order
## v1.2.1
### Fixed
* [SER-349](https://oneacrefund.atlassian.net/browse/SER-349) Change USSD response for core clients who would want to be enrolled at the Duka
## v1.2.0
### Fixed
* [SER-344](https://oneacrefund.atlassian.net/browse/SER-344) Adjust USSD non-client menu for Kenya
### Added
* [SER-343](https://oneacrefund.atlassian.net/browse/SER-343) Enable prepayment calculator for Kipkelion and Chwele
### Fixed
* [SER-311](https://oneacrefund.atlassian.net/browse/SER-311) Update Current Season and Previous Seasons for new SHS season

## v1.1.3
### Fixed
* [SER-347](https://oneacrefund.atlassian.net/browse/SER-347) show amount to pay in Swahili translation

## v1.1.2
### Fixed
* [SER-346](https://oneacrefund.atlassian.net/browse/SER-346) Remove Biolite SHS from 2021B USSD Enrollment Rwanda 
### Fixed
* [SER-340](https://oneacrefund.atlassian.net/browse/SER-340) add group validation in TR

## v1.1.1
### Added
* [SER-330](https://oneacrefund.atlassian.net/browse/SER-330) Configure November Chicken confirmations - changed the chicken eligibility calculations and updated the cap

## v1.1.0
### Added
* [SER-335](https://oneacrefund.atlassian.net/browse/SER-335) Add Duka registration support for returning Duka clients

## v1.0.9
### Added
* [SER-323](https://oneacrefund.atlassian.net/browse/SER-323) RW - Rearrange the products in the system
* [SER-322](https://oneacrefund.atlassian.net/browse/SER-322) RW - Add the maximum order per product in the system
* [SER-318](https://oneacrefund.atlassian.net/browse/SER-318) Duka registration is not sending account number to elk as expected
* [SER-277](https://oneacrefund.atlassian.net/browse/SER-277) As a OAF non client, I want to be able to access CE services through the USSD system so that I can report issues.
* [SER-275](https://oneacrefund.atlassian.net/browse/SER-275) As a farmer I want to be able to report seed germination issue through USSD so that it can be investigated and I can get my refund

## v1.0.8
### Fixed
* [SER-331](https://oneacrefund.atlassian.net/browse/SER-331) Duka-client sessions failing

## v1.0.7
### Fixed
* [SER-328](https://oneacrefund.atlassian.net/browse/SER-328) USSD Failing when group size is too big

## v1.0.6
### Fixed
* [SER-315](https://oneacrefund.atlassian.net/browse/SER-315) USSD sessions failing on API request

## v1.0.5
### Removed
* [SER-312](https://oneacrefund.atlassian.net/browse/SER-312) Remove all trainings except soil trainings and maize recommendation 

## v1.0.4
### Fixed
* [SER-313](https://oneacrefund.atlassian.net/browse/SER-313) Client data size too long

## v1.0.3
### Fixed
* [SER-317](https://oneacrefund.atlassian.net/browse/SER-317) Check balance failing on kenya USSD menu

## v1.0.2
### Fixed
* [SER-314](https://oneacrefund.atlassian.net/browse/SER-314) Clients are no longer able to access NHIF hospitals through USSD

## v1.0.1
### Changed
* [SER-316](https://oneacrefund.atlassian.net/browse/SER-316) Add a descriptive feedback when the registration fails

## v1.0.0
### Added
* [SER-10](https://oneacrefund.atlassian.net/browse/SER-10) As a client, I want to see my distance from the healthy path in repayment receipts, so that I know if I'm on track or not
* [SER-13](https://oneacrefund.atlassian.net/browse/SER-13) As a client, I want to be able to see my distance from the healthy path when I check my balance, so that I know how I stand with repayment - KE Config
* [SER-14](https://oneacrefund.atlassian.net/browse/SER-14) As a client, I want to be able to see my distance from the healthy path when I check my balance, so that I know how I stand with repayment - RW Config
* [SER-228](https://oneacrefund.atlassian.net/browse/SER-228) Prevent control sites from accessing nutrition training
* [SER-276](https://oneacrefund.atlassian.net/browse/SER-276) As a farmer I want to be able to see an "report enrollment issues" option on my menu so that I can be able to report enrollment issues
* [SER-190](https://oneacrefund.atlassian.net/browse/SER-190) Updated Test Coverage Thresholds
* [SER-190](https://oneacrefund.atlassian.net/browse/SER-190) Added test coverage details to [azure devops](https://dev.azure.com/OAFDev/prd-pipelines/_build/results?buildId=3681&view=codecoverage-tab)
* Fixed Changelog formating

### Fixed
* [SER-307](https://oneacrefund.atlassian.net/browse/SER-307) - Credit Officers to be added to recieve SMS for account numbers
* [SER-308](https://oneacrefund.atlassian.net/browse/SER-308) - Fix the Kenya Impact trainings menu
* [SER-307](https://oneacrefund.atlassian.net/browse/SER-307) - SMSs are not being sent after duka client registration

## 2020-10-20
### Added

* [SER-217](https://oneacrefund.atlassian.net/browse/SER-227) As a client, I want to access a nutrition training, so that I can improve the health of my family 

## 2020-10-19
### Fixed
[SER-262](https://oneacrefund.atlassian.net/browse/SER-262) - RW USSD enrollment - updated the the districts, fixed the missing client-id
[SER-264](https://oneacrefund.atlassian.net/browse/SER-264) - RW USSD enrollment - Update translations for menus and notifications

## 2020-10-16
### Added
[SER-262](https://oneacrefund.atlassian.net/browse/SER-262) - RW USSD enrollment - Optimize backward navigation
[SER-263](https://oneacrefund.atlassian.net/browse/SER-263) - RW USSD enrollment - Change the flow by reducing steps
[SER-218](https://oneacrefund.atlassian.net/browse/SER-218) As a client, I want to access a soil training, so that I understand how to maintain healthy soil
[SER-274](https://oneacrefund.atlassian.net/browse/SER-274) - Add layaway to the USSD enrollment app for the Dukas

## 2020-10-09
### Fixed

[THD-3213](https://oneacrefund.atlassian.net/browse/THD-3213) Wrong Account Generation
Updated the the registration service to match it's endpoint. AccountNumber is now returned as a key value pair instead of just a string when there is a national Id conflict 

## 2020-10-08
### Fixed

[THD-3170](https://oneacrefund.atlassian.net/browse/THD-3170) - Include two confirmation SMSes for the USSD Registration service
fixed the issue of sending sms with FO contact when available

## 2020-10-07
### Fixed

[THD-3213](https://oneacrefund.atlassian.net/browse/THD-3213) Wrong Account Generation
check if the account number is nan before displaying it to the user

## 2020-10-06
### Added

[SER-268](https://oneacrefund.atlassian.net/secure/RapidBoard.jspa?rapidView=83&selectedIssue=SER-268) - Add a column to save the difference in the avocado intead of overwriting the old One

## 2020-10-05
### Changed

[SER-260](https://oneacrefund.atlassian.net/browse/SER-260) Update landing page menu

### Added

[SER-17](https://oneacrefund.atlassian.net/browse/SER-17) - Add check shs warranty expiration.\

## 2020-10-02
### Fixed
[SER-258](https://oneacrefund.atlassian.net/browse/SER-258) Duka Registration users not receiving SMSs
When registering a new user, account number SMSs are not sent to clients.

## 2020-10-02
### Fixed

[SER-209](https://oneacrefund.atlassian.net/browse/SER-209) As a client, I want to add avocado trees to my order, so that I can plant a high-impact product

Before the newly registered client could not place an order because of their account numbers are not in the client's ordered avocado table. This fixes it and saves a row on the table after registration

[SER-208](https://oneacrefund.atlassian.net/browse/SER-208) As a non-client, I want to register via USSD, so that I can purchase avocado trees through OAF

Before the groupId was not saved in the registration table. this fixes it

## 2020-10-01
### Fixed
[SER-256](https://oneacrefund.atlassian.net/browse/SER-256) USSD Client Registration menu not working - KE
Added an else to if to make sure the menu is beaving normally

## 2020-09-29
### Added

[SER-244](https://oneacrefund.atlassian.net/browse/SER-244)Make sure new clients can't register with special characters in their names


## 2020-09-23
### Added
*[SER-255](https://oneacrefund.atlassian.net/browse/SER-255)Re-configuration of October chicken USSD confirmation service - kenya
Replaced the chicken cup number


## 2020-09-29
### Changed

*[SER-244](https://oneacrefund.atlassian.net/browse/SER-244) Make sure new clients can't register with special characters in their names
changed the duka registration service to validate names so that no special characters be sent


## 2020-09-24
### Added

* [SER-219](https://oneacrefund.atlassian.net/browse/SER-219) As a client, I want to be able to receive a maize recommendation, so that I know which variety is optimal for me

## 2020-09-23
## Added

* [SER-209](https://oneacrefund.atlassian.net/browse/SER-209) As a client, I want to add avocado trees to my order, so that I can plant a high-impact product
* [SER-206](https://oneacrefund.atlassian.net/browse/SER-206) As a credit officer, I want to register clients so that their purchase can be recorded in Roster
* [SER-221](https://oneacrefund.atlassian.net/browse/SER-221) Create a data table in Telerivet that stores a client's account number and invoice ID

## Changed

* [SER-9](https://oneacrefund.atlassian.net/browse/SER-9)As a GL, I want to be able to top up a client's order via USSD, so that I can adjust orders prior to distribution
Before one sms was being sent to the phone being used for the session. This changes it to send another sms on the client's active phone stored in Roster. It also change the content of the sms to include the ordered products 


## 2020-09-21
### Added

* [SER-208](https://oneacrefund.atlassian.net/browse/SER-208) As a non-client, I want to register via USSD, so that I can purchase avocado trees through OAF
* [SER-225](https://oneacrefund.atlassian.net/browse/SER-225) As a prospective client, I want to locate an agrodealer partnered with One Acre Fund, so that I can buy inputs on credit
