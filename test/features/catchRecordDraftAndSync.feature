@catchRecord
@draftAndSync
Feature:Continue with catch a record after closing

    As a fisher
    I want my catch record progress to be saved and sent when I have a connection
    So that I do not lose my record when I leave the application or lose signal

    Background:
        Given I am signed in

    # Draft auto-save, offline submission, sync and record status scenarios are covered by
    # manageCatchRecordsOffline.feature (CRAR-165).
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
