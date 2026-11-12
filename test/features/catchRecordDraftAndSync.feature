@catchRecord
@draftAndSync
Feature:Continue with catch a record after closing

    As a fisher
    I want my catch record progress to be saved and sent when I have a connection
    So that I do not lose my record when I leave the application or lose signal

    Background:
        Given I am signed in

    Scenario: Draft saved while user is completing a record
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I leave and reopen the application
        And I am signed in
        Then a record with status "Draft" is displayed
        When I continue the draft catch record
        Then I should be on the departure port page

    Scenario: Catch area map resumes after the app is minimised
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        Then the catch area map is displayed
        When I minimise the app for 10 seconds
        Then the catch area map is displayed
        When I select a statistical sub area on the map
        Then the selected area is highlighted

    @offline
    Scenario: Submission fails while offline
        Given I am offline
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select a statistical sub area on the map
        And I select Save and Continue
        And I select species with the following weights:
            | species          | retained | below minimum | discarded |
            | Brown crab (TBC) | 5        | 1             | 1         |
        And I select no delayed landing
        And I accept and submit the catch record
        Then the offline banner is displayed
        When I view my records
        Then a record with status "unsent" is displayed

    @offline
    Scenario: Connectivity is restored
        Given I have a catch record with status "unsent"
        When I go back online
        Then a record with status "Submitted" is displayed

    @offline
    Scenario: User views record statuses
        Given I have a submitted catch record
        And I have a catch record with status "unsent"
        And I have a draft catch record
        When I open my records list
        Then a record with status "Draft" is displayed
        And a record with status "unsent    " is displayed
        And a record with status "Submitted" is displayed
