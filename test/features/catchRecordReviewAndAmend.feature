@catchRecord @reviewAndAmend
Feature: Catch record review and amend journey

    Background:
        Given I am signed in
        And I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I select species "Brown crab (TBC)" with retained 5, below minimum 1 and discarded 1 weights

    Scenario: TC-5.1 Record catch that is not landed immediately (stored catch)
        When I select a delayed landing
        Then a message containing "kept on board" or "stored in" is displayed
        And a message containing "Brown crab" is displayed
        When I select the first stored catch species
        And I enter a stored catch weight of "2"
        Then the catch record summary is displayed
        And the summary shows stored catch "Brown crab" with weight "2"

    Scenario: TC-5.5 Edit sections directly from the review screen
        When I select no delayed landing
        Then the catch record summary is displayed
        When I change the departure port to "Plymouth" from the summary
        Then the summary shows "Departure port" as "Plymouth"
