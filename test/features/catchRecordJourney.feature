@catchRecord
Feature: Catch record end-to-end journey

    Background:
        Given I am signed in

    Scenario: Successfully complete a catch record (Happy Path)
        When I start a catch record
        And I select vessel "ACHILLES"
        And I enter a trip start date of 2 days ago
        And I enter a trip end date of today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I select species with the following weights:
            | species         | retained | below minimum | discarded |
            | Brown crab (TBC) | 5        | 1             | 1         |
        And I select no delayed landing
        Then I should be on the catch record summary page
        And the summary shows "Vessel" as "ACHILLES"
        And the summary shows "Departure port" as "Hastings"
        When I accept and submit the catch record
        Then I should be on the submission success page
        And a record reference is shown
        When I view my records
        Then I should be on the home page

    @offline
    Scenario: Successfully complete a catch record (Offline Happy Path)
        Given I am offline
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I select species with the following weights:
            | species         | retained | below minimum | discarded |
            | Brown crab (TBC) | 5        | 1             | 1         |
        And I select no delayed landing
        Then I should be on the catch record summary page
        When I accept and submit the catch record
        Then the offline banner is displayed
        And a record reference is shown
        When I view my records
        Then I should be on the home page
