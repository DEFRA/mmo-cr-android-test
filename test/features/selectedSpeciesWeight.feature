@catchRecord @selectedSpecies
Feature: Selected species weight validations

    Background:
        Given I am signed in
        And I start a catch record
        And I select vessel "ACHILLES"
        And I enter a trip start date of 2 days ago
        And I enter a trip end date of today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots
        And I select catch area "38E95"
        And I search "br" and add species "Brown crab (TBC)"

    Scenario: Validate all weight entry requirements (AC1-AC11)
        # AC1 & AC2: catch weight and optional weights
        When I select the species "Brown crab (TBC)"
        Then the retained weight field is displayed
        When I add a below minimum size weight
        Then the below minimum size weight field is displayed
        When I add a legally discarded weight
        Then the legally discarded weight field is displayed
        # AC6: blank weight above minimum size retained
        When I clear the retained weight
        And I save and continue
        Then a message containing "Enter the Weight above minimum" is displayed
        # AC7: discarded weight higher than retained weight
        When I enter a retained weight of "5"
        And I enter a legally discarded weight of "10"
        And I save and continue
        Then a message containing "must be higher then Weight legally discarded" is displayed
        # AC8: two decimal places
        When I enter a legally discarded weight of ""
        And I enter a retained weight of "10.55"
        And I save and continue
        Then a message containing "must be a number with up to one decimal place" or "must be a whole number" is displayed
        # AC9: weight limit 0
        When I enter a retained weight of "0"
        And I save and continue
        Then a message containing "must be a more the 0KG" or "must be more than 0kg" is displayed
        # AC10: weight limit 10,000
        When I enter a retained weight of "10001"
        And I save and continue
        Then a message containing "must be a 10,000 or less" is displayed
        # AC11: minus or letters
        When I enter a retained weight of "-5"
        And I save and continue
        Then a message containing "must be a more the 0KG" or "must be more than 0kg" is displayed
        When I enter a retained weight of "abc"
        And I save and continue
        Then a message containing "must be a number" is displayed
        # AC3: edit weights
        When I enter a retained weight of "5.5"
        And I enter a below minimum size weight of "2"
        And I enter a legally discarded weight of "1"
        And I save and continue
        Then a message containing "Are you delaying the landing" is displayed

    Scenario: Add and remove species (AC4 & AC5)
        When I choose to add another species
        Then the species search screen is displayed
        When I search "Atlantic cod" and add species "Atlantic cod"
        Then the selected species screen is displayed
        When I choose to remove a species
        Then a message containing "Remove" is displayed
