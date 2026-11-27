@signIn @CRAR-282
Feature: Android sign-in screen

    Scenario: Displays the sign-in controls
        Then the sign-in controls are displayed

    Scenario: Hides the create account instructions when the link is clicked again
        When I open the create an account link
        Then the create account instructions are displayed
        When I open the create an account link
        Then the create account instructions are hidden

    Scenario: Keeps the expanded create account instructions visible after scrolling
        When I open the create an account link
        And I scroll the create account instructions into view
        Then the create account instructions are displayed

    Scenario: Accepts email and password input
        When I enter email "test@example.com"
        And I enter password "Password123!"
        Then the email field shows the entered email
        And the password field contains the entered password length
        And the password field is masked

    Scenario: Validates both empty fields without losing the sign-in controls
        When I enter email ""
        And I enter password ""
        Then the email field shows the entered email
        And the password field is empty
        And the sign-in button is displayed
        When I submit the sign-in form
        Then a message containing "Please enter your email address." is displayed
        And a message containing "Please enter your password." is displayed

    Scenario: Shows an email-required message when email is empty
        When I enter email ""
        And I enter the test account password
        And I submit the sign-in form
        Then a message containing "Please enter your email address." is displayed

    Scenario: Shows a password-required message when password is empty
        When I enter the test account email
        And I enter password ""
        And I submit the sign-in form
        Then a message containing "Please enter your password." is displayed

    Scenario: Shows an email-format message for an invalid email address
        When I enter email "not-an-email"
        And I enter the test account password
        And I submit the sign-in form
        Then a message containing "Please enter a valid email address." is displayed

    Scenario: Shows an error when the test account password is incorrect
        When I enter an incorrect password for the test account
        And I submit the sign-in form
        Then a message containing "Invalid email address or password. Please try again." is displayed

    Scenario: Signs in with valid test account credentials
        When I sign in with the test account credentials
        Then I should be on the home page

    Scenario: Handles whitespace and special characters in credentials
        When I enter email "  test+tag@example.com  "
        And I enter password " P@ss w0rd!#$  "
        Then the email field shows its trimmed value
        And the password field contains the entered password length

    Scenario: Handles long credential values
        When I enter an email with a 64 character local part
        And I enter a password of 128 characters
        Then the email field shows the entered email
        And the password field contains the entered password length
