@catchRecord @businessRules
Feature: Catch record business rules and offline handling

    Background:
        Given I am signed in

    Scenario: Mandatory single-choice questions (vessel selection)
        When I start a catch record
        Then the vessel selection screen is displayed
        When I save and continue
        Then a message containing "problem" or "Select" is displayed

    Scenario: Restrict historical trip dates (365 days limit)
        When I start a catch record
        And I select vessel "ACHILLES"
        And I enter a trip start date of 366 days ago
        Then a message containing "365" or "past" is displayed

    Scenario: Display suggested statistical areas and allow "Other"
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        Then the catch area map is displayed
        When I choose the "Other" catch area
        Then the catch sub area screen is displayed

    @skip
    Scenario: Save and maintain favourites

    Scenario: Late submission warning (trip more than 24 hours ago)
        When I start a catch record
        And I select vessel "ACHILLES"
        And I enter a trip start date of 3 days ago
        And I enter a trip end date of 3 days ago
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "Other" with sub area "38E95"
        And I select species "Brown crab (TBC)" with retained 5, below minimum 1 and discarded 1 weights
        And I select no delayed landing
        Then the catch record summary is displayed
        When I accept and submit the catch record
        Then a message containing "review the trip end date" or "warning" is displayed
        And the record is submitted once the late submission warning is acknowledged

    @offline
    Scenario: Retain records when offline and retry submission
        Given I am offline
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "Other" with sub area "38E95"
        And I select species "Brown crab (TBC)" with retained 5, below minimum 1 and discarded 1 weights
        And I select no delayed landing
        And I accept and submit the catch record
        Then the offline banner is displayed
        When I view my records
        Then a record with status "Complete Not Submitted" is displayed
        When I go back online
        Then a record with status "Submitted" is displayed

    @skip
    Scenario: Auto-save draft records and prevent data loss

    @skip
    Scenario: Duplicate submission and conflict resolution

    Scenario: Invalid trip dates (return date before departure date)
        When I start a catch record
        And I select vessel "ACHILLES"
        And I enter a trip start date of today
        And I enter a trip end date of 1 day ago
        Then a message containing any of these is displayed:
            | before            |
            | cannot be earlier |
            | after             |

    Scenario: Invalid gear measurements (decimals and negatives)
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I search and select gear "Seine nets"
        And I enter mesh size "10.5"
        Then a message containing "whole number" is displayed
        When I replace the mesh size with "-5"
        Then a message containing "cannot be negative" or "more than 0" is displayed
