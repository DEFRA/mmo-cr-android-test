@catchRecord
Feature:Validate catch-record trip dates and duration

    As a catch-recording user
    I want the service to validate the trip start date and trip duration
    So that trips outside the permitted reporting period or exceeding the maximum permitted duration cannot be recorded

    Background:
        Given I am signed in
        When I start a catch record
        And I select vessel "ACHILLES"

    Scenario: Valid trip dates are accepted
        When I enter a trip start date of 2 days ago
        And I enter a trip end date of today
        Then I should be on the departure port page

    Scenario: Trip start date more than 365 days ago is rejected
        When I try to enter a trip start date of 366 days ago
        Then I should be on the trip start date page
        And a message containing "The trip start date cannot be more than 365 days in the past" is displayed

    Scenario: Trip longer than 30 days is rejected
        When I enter a trip start date of 31 days ago
        And I try to enter a trip end date of today
        Then I should be on the trip end date page
        And a message containing "30 days" is displayed

    Scenario: Trip end date before the start date is rejected
        When I enter a trip start date of 2 days ago
        And I try to enter a trip end date of 3 days ago
        Then I should be on the trip end date page
        And a message containing "The trip end date cannot be before the trip start date" is displayed

    Scenario: Trip start date exactly 365 days ago is accepted
        When I enter a trip start date of 365 days ago
        And I enter a trip end date of 365 days ago
        Then I should be on the departure port page

    Scenario: Trip of exactly 30 days is accepted
        When I enter a trip start date of 30 days ago
        And I enter a trip end date of today
        Then I should be on the departure port page

    Scenario: Same-day trip is accepted
        When I enter a trip start date of 5 days ago
        And I enter a trip end date of 5 days ago
        Then I should be on the departure port page
