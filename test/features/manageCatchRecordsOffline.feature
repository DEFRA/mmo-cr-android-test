@catchRecord
Feature:Create, save, submit and manage catch records offline

    As a vessel owner, skipper or authorised user
    I want to create catch records and keep working offline
    So that my catch records are submitted when connectivity is available

    Background:
        Given I am signed in

    Scenario Outline: <question> question must be answered
        Given I have reached the "<question>" question
        When I continue without answering the "<question>" question
        Then a message containing "<message>" is displayed

        # Vessel and same-day trip move on as soon as an option is chosen, so they cannot be left unanswered.
        Examples:
            | question         | message                                                                      |
            | Draft action     | Select what you want to do with your draft record                            |
            | Statistical area | Select the statistical sub area where the majority of your catch was caught. |


    Scenario: Trip start date over 365 days ago is rejected
        When I start a catch record
        And I select vessel "ACHILLES"
        And I try to enter a trip start date of 366 days ago
        Then I should be on the trip start date page
        And I should see a validation error on the trip start date page

    Scenario: Suggested sub areas are shown for the departure port
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And the catch area map is displayed
        And I choose the "Other" catch area
        Then the catch sub area screen is displayed
        And the sub area "30F04" is in the suggested list
        When I select the suggested sub area "30F04"
        And I save and continue
        Then I should be on the species page

    Scenario: Search for a different sub area using Other
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And the catch area map is displayed
        And I choose the "Other" catch area
        And the catch sub area screen is displayed
        And the sub area "31F15" is not in the suggested list
        When I select the "Other" sub area
        And I enter sub area code "31F"
        And I select the sub area result "31F15"
        Then the sub area field shows "31F15"
        When I save and continue
        Then I should be on the species page

    Scenario: Late submission warning can be acknowledged
        When I start a catch record
        And I select vessel "ACHILLES"
        And I enter a trip start date of 3 days ago
        And I enter a trip end date of 2 days ago
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I select species with the following weights:
            | species | retained | below minimum | discarded |
            | Brill   | 5        | 1             | 1         |
        And I select no delayed landing
        Then I should be on the late submission warning page
        And a message containing "being submitted 2 days after the trip end date" is displayed
        And a message containing "Catch records must be submitted within 24 hours of a trip ending" is displayed
        When I acknowledge the late submission warning
        Then I should be on the catch record summary page
        When I accept and submit the catch record
        Then I should be on the submission success page

    @offline
    Scenario: Completed record is kept locally when offline
        Given I am offline
        And I have a catch record awaiting sync
        When I leave and reopen the application
        And I am signed in
        Then a record with status "Unsent" is displayed

    @offline
    Scenario: User is told an offline record is not yet submitted
        Given I am offline
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I select species with the following weights:
            | species        | retained | below minimum | discarded |
            | Zebra seabream | 5        | 1             | 1         |
        And I select no delayed landing
        And I accept and submit the catch record
        Then I should be on the submission success page
        And a message containing "saved and sent when you're back online" is displayed
        And a record reference is shown
        When I view my records
        Then a record with status "Unsent" is displayed

    @offline
    Scenario: Unsent record is submitted when back online
        Given I am offline
        And I have a catch record awaiting sync
        When I go back online
        Then a record with status "Submitted" is displayed

    Scenario: Draft is auto-saved within 10 seconds
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I wait 10 seconds
        And I leave and reopen the application
        And I am signed in
        Then a record with status "Draft" is displayed
        When I continue the draft catch record
        Then I should be on the departure port page
        When I delete the draft catch record
        Then the deleted draft catch record is not displayed

    @offline
    Scenario: Draft is kept when connectivity is lost
        When I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I am offline
        And I leave and reopen the application
        And I am signed in
        Then a record with status "Draft" is displayed
        When I continue the draft catch record
        Then I should be on the departure port page
        When I delete the draft catch record
        Then the deleted draft catch record is not displayed

    # AC16-AC19 cover backend sync behaviour that is not observable through the Android UI.
    # Verify them manually or with backend/API tests; no step definitions are implemented.
    @manual @skip
    Scenario: Duplicate submission is not recorded twice
        Given a catch record submission has already been received
        When the same submission is received again
        Then the duplicate submission is detected
        And no duplicate catch record is created

    @manual @skip
    Scenario: Pending records are synced in order
        Given several catch records are awaiting sync
        When connectivity is restored
        Then the records are submitted in the defined order
        And the outcome of each submission is recorded

    @manual @skip
    Scenario: Sync conflict is resolved
        Given a catch record awaiting sync conflicts with the server copy
        When the record is synced
        Then the conflict is resolved using the agreed rules
        And the outcome is recorded for audit

    @manual @skip
    Scenario: Failed submissions retry with backoff
        Given a catch record submission keeps failing
        When the submission is retried
        Then the retries follow the configured backoff
        And no duplicate catch record is created
