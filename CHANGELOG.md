# CHANGELOG
All notable changes to this project will be documented in this file. 

## 2020-10-19
### Fixed

[SER-264] (https://oneacrefund.atlassian.net/browse/SER-264) - RW USSD enrollment - Update translations for menus and notifications

## 2020-10-16
### Added

[SER-274] (https://oneacrefund.atlassian.net/browse/SER-274) - Add layaway to the USSD enrollment app for the Dukas

## 2020-10-09
### Fixed

[THD-3213] (https://oneacrefund.atlassian.net/browse/THD-3213) Wrong Account Generation
Updated the the registration service to match it's endpoint. AccountNumber is now returned as a key value pair instead of just a string when there is a national Id conflict 

## 2020-10-08
### Fixed

[THD-3170] (https://oneacrefund.atlassian.net/browse/THD-3170) - Include two confirmation SMSes for the USSD Registration service
fixed the issue of sending sms with FO contact when available

## 2020-10-07
### Fixed

[THD-3213] (https://oneacrefund.atlassian.net/browse/THD-3213) Wrong Account Generation
check if the account number is nan before displaying it to the user

## 2020-10-06
### Added

[SER-268](https://oneacrefund.atlassian.net/secure/RapidBoard.jspa?rapidView=83&selectedIssue=SER-268) - Add a column to save the difference in the avocado intead of overwriting the old One

## 2020-10-05
### Changed

[SER-260] (https://oneacrefund.atlassian.net/browse/SER-260) Update landing page menu

### Added

[SER-17](https://oneacrefund.atlassian.net/browse/SER-17) - Add check shs warranty expiration.

## 2020-10-02
### Fixed
[SER-258](https://oneacrefund.atlassian.net/browse/SER-258) Duka Registration users not receiving SMSs
When registering a new user, account number SMSs are not sent to clients.

## 2020-10-02
### Fixed

[SER-209] (https://oneacrefund.atlassian.net/browse/SER-209) As a client, I want to add avocado trees to my order, so that I can plant a high-impact product

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
*[SER-255] (https://oneacrefund.atlassian.net/browse/SER-255)Re-configuration of October chicken USSD confirmation service - kenya
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
