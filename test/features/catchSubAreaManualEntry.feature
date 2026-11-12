@catchRecord
@catchSubArea
Feature:(CRAR-123) Manually enter statistical sub area 

    As a fisher
    I want to select "Other" when my statistical sub area is not listed in the predefined radio button options
    So that I can manually enter the correct statistical sub area code where most of my catch was caught.

    Background:
        Given I am signed in
        And I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And the catch area map is displayed
        And I choose the "Other" catch area
        And the catch sub area screen is displayed

    Scenario: Display manual entry field
        Given the sub area "31F15" is not in the suggested list
        When I select the "Other" sub area
        Then the sub area type-ahead field is displayed
        When I enter sub area code "31F15"
        Then the sub area field shows "31F15"

    Scenario: Display matching results
        Given I select the "Other" sub area
        When I enter sub area code "12"
        Then each sub area result shows a code containing "12" and coordinates
        And the sub area result "27E12" shows ICES rectangle "27E1"

    Scenario: Auto-populate coordinates
        Given I select the "Other" sub area
        When I enter sub area code "31F15"
        Then the coordinates for sub area "31F15" are displayed
        When I enter sub area code "31F16"
        Then the coordinates for sub area "31F16" are displayed
        And the sub area coordinates have changed

    Scenario: Select a suggested area
        Given I select the "Other" sub area
        And I enter sub area code "31F"
        When I select the sub area result "31F15"
        Then the sub area field shows "31F15"
        And the centre of the selected sub area is displayed
        When I save and continue
        And I select species with the following weights:
            | species         | retained | below minimum | discarded |
            | Atlantic salmon | 5        | 1             | 1         |
        And I select no delayed landing
        Then the catch record summary is displayed
        And the summary shows sub area "31F15"

    Scenario: Invalid statistical sub area
        Given I select the "Other" sub area
        And I enter sub area code "99Z99"
        When I save and continue
        Then a message containing "Enter a valid statistical sub area code." is displayed
