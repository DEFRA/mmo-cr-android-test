@catchRecord
@catchSubAreaMap
Feature:(CRAR-120) Select statistical sub area using the map

    As a fisher
    I want to select the statistical sub area where the majority of my catch was caught using either an interactive map or a list of statistical sub areas
    So that I can quickly and accurately record the location of my fishing activity in the way that best suits me.

    Background:
        Given I am signed in
        And I start a catch record
        And I select vessel "ACHILLES"
        And I select a trip for today
        And I select departure port "Hastings" and return port "Dover"
        And I select gear "Seine nets" with mesh size 10 and 10 shots

    Scenario: Select area using the map
        Given the catch area map is displayed
        When I select a statistical sub area on the map
        Then the selected area is highlighted
        And the corresponding list item is selected

    Scenario: Save selected area
        Given the catch area map is displayed
        And I have selected a statistical sub area
        When I select Save and Continue
        Then I proceed to the next step of the catch recording journey
        When I select species with the following weights:
            | species         | retained | below minimum | discarded |
            | Atlantic salmon | 5        | 1             | 1         |
        And I select no delayed landing
        Then the selected statistical sub area is attached to the catch record

    Scenario: No area selected
        Given the catch area map is displayed
        When I select Save and Continue without selecting an area
        Then a message containing "Select the statistical sub area where the majority of your catch was caught." is displayed

    Scenario: Zoom in and out of the map
        Given the catch area map is displayed
        When I zoom in on the map
        Then the map view changes
        When I zoom out on the map
        Then the map view changes

    Scenario Outline: Drag the map <direction>
        Given the catch area map is displayed
        And I zoom in on the map
        When I drag the map <direction>
        Then the map view changes

        Examples:
            | direction |
            | up        |
            | down      |
            | left      |
            | right     |
