@catchRecord
@selectedSpecies
Feature: Record catch weights for selected species
    As a vessel owner or vessel operator
    I want to record catch weights for each selected fish species
    So that catch reporting, traceability, quota monitoring and regulatory compliance are supported.

    Background:
        Given I am signed in
        And I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I search "At" and add species "Atlantic salmon"

    Scenario: Display and edit weights for a selected species
        When I select the species "Atlantic salmon"
        Then the retained weight field is displayed
        When I add a below minimum size weight
        Then the below minimum size weight field is displayed
        When I add a legally discarded weight
        Then the legally discarded weight field is displayed

        When I enter "5" in the "above minimum size retained" weight field
        And I enter "2" in the "below minimum size retained" weight field
        And I enter "1" in the "legally discarded" weight field
        And I enter "6" in the "above minimum size retained" weight field
        And I enter "2.5" in the "below minimum size retained" weight field
        And I enter "1.5" in the "legally discarded" weight field
        And I save and continue
        Then a message containing "Is there any catch from this trip that you will not be landing straight away?" is displayed

    Scenario: Require above minimum size retained weight
        When I select the species "Atlantic salmon"
        And I clear the retained weight
        And I save and continue
        Then a message containing "Enter the weight above minimum size retained" is displayed

    Scenario: Save a species without optional weights
        When I select the species "Atlantic salmon"
        And I enter "5" in the "above minimum size retained" weight field
        And I save and continue
        Then a message containing "Is there any catch from this trip that you will not be landing straight away?" is displayed

    Scenario: Require retained weight to exceed legally discarded weight
        When I select the species "Atlantic salmon"
        And I add a legally discarded weight
        And I enter "5" in the "above minimum size retained" weight field
        And I enter "10" in the "legally discarded" weight field
        And I save and continue
        Then a message containing "must be higher than" is displayed

        When I enter "10" in the "above minimum size retained" weight field
        And I enter "10" in the "legally discarded" weight field
        And I save and continue
        Then a message containing "must be higher than" is displayed

    Scenario Outline: Reject invalid values in each species weight field
        When I select the species "Atlantic salmon"
        And I add a below minimum size weight
        And I add a legally discarded weight
        And I enter "5" in the "above minimum size retained" weight field
        And I enter "2" in the "below minimum size retained" weight field
        And I enter "1" in the "legally discarded" weight field

        When I enter "0" in the "<field>" weight field
        And I save and continue
        Then a message containing "must be more than 0kg" is displayed

        When I enter "<valid weight>" in the "<field>" weight field
        And I enter "10001" in the "<field>" weight field
        And I save and continue
        Then a message containing "must be 10,000kg or less" is displayed

        When I enter "<valid weight>" in the "<field>" weight field
        And I enter "10.55" in the "<field>" weight field
        And I save and continue
        Then a message containing "number with up to one decimal place" is displayed

        When I enter "<valid weight>" in the "<field>" weight field
        And I enter "-5" in the "<field>" weight field
        And I save and continue
        Then a message containing "must be more than 0kg" is displayed

        When I enter "<valid weight>" in the "<field>" weight field
        And I enter "abc" in the "<field>" weight field
        And I save and continue
        Then a message containing "must be a number" is displayed

        Examples:
            | field                       | valid weight |
            | above minimum size retained | 5            |
            | below minimum size retained | 2            |
            | legally discarded           | 1            |

    Scenario: Allow a weight at the 10,000 kg limit
        When I select the species "Atlantic salmon"
        And I add a below minimum size weight
        And I add a legally discarded weight
        And I enter "10000" in the "above minimum size retained" weight field
        And I enter "10.5" in the "below minimum size retained" weight field
        And I enter "9999" in the "legally discarded" weight field
        And I save and continue
        Then a message containing "Is there any catch from this trip that you will not be landing straight away?" is displayed

    Scenario: Open the add species screen
        When I choose to add another species
        Then the species search screen is displayed

    Scenario: Open species removal options
        When I choose to remove a species
        Then a message containing "Remove" is displayed
