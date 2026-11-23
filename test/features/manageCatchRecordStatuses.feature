@catchRecord
Feature:Manage catch record statuses

    As a vessel owner, skipper or authorised user
    I want to see the correct status for each of my catch records
    So that I know which records are drafts, waiting to be sent or submitted

    Background:
        Given I am signed in

    Scenario: Started record that has not been submitted shows status Draft
        Given I have a catch record with status "Draft"
        When I open my records list
        Then a record with status "Draft" is displayed
        When I delete the draft catch record
        Then the deleted draft catch record is not displayed

    Scenario: Record received by the backend shows status Submitted
        Given I have a catch record with status "Submitted"
        When I open my records list
        Then a record with status "Submitted" is displayed

    @offline
    Scenario: Completed record not yet received by the backend shows status Complete/Pending
        Given I am offline
        And I have a catch record with status "Complete/Pending"
        When I open my records list
        Then a record with status "Complete/Pending" is displayed

    @offline
    Scenario: Complete/Pending record changes to Submitted once received by the backend
        Given I am offline
        And I have a catch record with status "Complete/Pending"
        When I go back online
        Then a record with status "Submitted" is displayed

    # Records can only be edited through the web service ("To edit trips ... use the web
    # service"), so the amendment cannot be made from the Android app. Verify manually.
    @manual @skip
    Scenario: Re-submitted amended record shows status Amended
        Given a submitted catch record has been edited and re-submitted on the web service
        When I open my records list
        Then a record with status "Amended" is displayed
        And the backend status of the record is "Submitted"

    # Backend status values are not observable through the Android UI.
    # Verify manually or with backend/API tests.
    @manual @skip
    Scenario: Only Draft and Submitted are persisted as backend statuses
        Given a catch record status is persisted in the backend
        When the backend stores or updates the status
        Then the backend status is one of "Draft" or "Submitted"
        And "Complete/Pending" and "Amended" are never persisted as backend statuses
