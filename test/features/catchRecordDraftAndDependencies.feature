@catchRecord
@drafts
Feature: Catch record drafts and dependencies

    Background:
        Given I am signed in

    Scenario: Implicit draft deletion prevention (resume draft)
        When I start a catch record
        And I select vessel "ACHILLES"
        And I go back 2 times
        Then the home screen is displayed
        When I start a catch record
        And I choose to continue the draft
        Then a message containing "trip today" or "trip start" is displayed

    Scenario: Delete existing draft
        When I start a catch record
        And I select vessel "ACHILLES"
        And I go back 2 times
        Then the home screen is displayed
        When I start a catch record
        And I choose to delete the draft
        Then the vessel selection screen is displayed

    Scenario: Remove gear cascade validation
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "Other" with sub area "38E95"
        Then a message containing "species" is displayed
        When I go back 2 times
        And I deselect "Seine nets"
        Then a message containing any of these is displayed:
            | dependent data  |
            | will be removed |
            | Are you sure    |
        And I confirm the removal

    Scenario: Record legally discarded catch with blank retained weight
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "Other" with sub area "38E95"
        And I add species "Brown crab (TBC)" with only a legally discarded weight of "5"
        Then a message containing "landing" or "not be landed" is displayed

    Scenario: Port to area cascade validation
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        Then a message containing "species" is displayed
        When I go back 5 times
        Then the departure port screen is displayed
        When I change the departure port to "Plymouth"
        And I continue past the return port and selected gears screens
        Then any catch area revalidation warning is displayed

    Scenario: Species to stored catch cascade validation
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I select species "Brown crab (TBC)" with retained 5, below minimum 1 and discarded 1 weights
        And I select a delayed landing
        And I enter a stored catch weight of "2"
        And I go back 3 times
        And I deselect "Brown crab"
        Then a message containing any of these is displayed:
            | dependent data  |
            | stored catch    |
            | will be removed |
        And I confirm the removal
