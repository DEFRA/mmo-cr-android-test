@signIn
Feature: Android sign-in screen

    Scenario: Displays the sign-in controls
        Then the sign-in controls are displayed

    Scenario: Displays instructions when the create an account link is clicked
        When I open the create an account link
        Then the create account instructions are displayed

    Scenario: Accepts email and password input
        When I enter email "test@example.com"
        And I enter password "Password123!"
        Then the email field shows the entered email
        And the password field contains the entered password length

    Scenario: Handles empty credentials without losing the sign-in controls
        When I enter email ""
        And I enter password ""
        Then the email field shows the entered email
        And the password field is empty
        And the sign-in button is displayed

    Scenario: Handles whitespace and special characters in credentials
        When I enter email "  test+tag@example.com  "
        And I enter password " P@ss w0rd!#$  "
        Then the email field shows the entered email
        And the password field contains the entered password length

    Scenario: Handles long credential values
        When I enter an email with a 64 character local part
        And I enter a password of 128 characters
        Then the email field shows the entered email
        And the password field contains the entered password length
