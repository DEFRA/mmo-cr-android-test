import { Then, When } from '@wdio/cucumber-framework';
import signInPage from '../page-objects/signInPage';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import type { CatchRecordWorld } from '../support/world';

function getTestAccountCredentials(world: CatchRecordWorld) {
    const credentials = getAndroidTestCredentials();
    world.email = credentials.email;
    world.password = credentials.password;
    return credentials;
}

When('I enter email {string}', async function (this: CatchRecordWorld, email: string) {
    this.email = email;
    await signInPage.enterEmail(email);
});

When('I enter password {string}', async function (this: CatchRecordWorld, password: string) {
    this.password = password;
    await signInPage.enterPassword(password);
});

When(
    'I enter an email with a {int} character local part',
    async function (this: CatchRecordWorld, length: number) {
        this.email = `${'a'.repeat(length)}@example.com`;
        await signInPage.enterEmail(this.email);
    },
);

When(
    'I enter a password of {int} characters',
    async function (this: CatchRecordWorld, length: number) {
        this.password = 'P'.repeat(length);
        await signInPage.enterPassword(this.password);
    },
);

When('I open the create an account link', async () => {
    await signInPage.openCreateAccount();
});

When('I enter the test account email', async function (this: CatchRecordWorld) {
    const { email } = getTestAccountCredentials(this);
    await signInPage.enterEmail(email);
});

When('I enter the test account password', async function (this: CatchRecordWorld) {
    const { password } = getTestAccountCredentials(this);
    await signInPage.enterPassword(password);
});

When('I enter an incorrect password for the test account', async function (this: CatchRecordWorld) {
    const { email, password } = getTestAccountCredentials(this);
    this.password = `${password}-invalid`;
    await signInPage.enterEmail(email);
    await signInPage.enterPassword(this.password);
});

When('I sign in with the test account credentials', async function (this: CatchRecordWorld) {
    const { email, password } = getTestAccountCredentials(this);
    await signInPage.signIn(email, password);
});

When('I submit the sign-in form', async () => {
    await signInPage.submitSignInForm();
});

When('I scroll the create account instructions into view', async () => {
    await signInPage.scrollUntilDisplayed(signInPage.vesselOwnerInstructions);
});

Then('the sign-in controls are displayed', async () => {
    await expect(signInPage.heading).toBeDisplayed();
    await expect(signInPage.emailLabel).toBeDisplayed();
    await expect(signInPage.emailField).toBeDisplayed();
    await expect(signInPage.passwordLabel).toBeDisplayed();
    await expect(signInPage.passwordField).toBeDisplayed();
    await expect(signInPage.signInButton).toBeDisplayed();
    await expect(signInPage.helpHeading).toBeDisplayed();
    await expect(signInPage.forgottenPasswordLink).toBeDisplayed();
    await expect(signInPage.createAccountLink).toBeDisplayed();
});

Then('the create account instructions are displayed', async () => {
    await expect(signInPage.vesselOwnerLabel).toBeDisplayed();
    await expect(signInPage.vesselOwnerInstructions).toBeDisplayed();
    await expect(signInPage.skipperOrAgentLabel).toBeDisplayed();
    await expect(signInPage.skipperOrAgentInstructions).toBeDisplayed();
});

Then('the email field shows the entered email', async function (this: CatchRecordWorld) {
    expect(await signInPage.emailField.getText()).toBe(this.email);
});

Then(
    'the password field contains the entered password length',
    async function (this: CatchRecordWorld) {
        expect((await signInPage.passwordField.getText()).length).toBe(this.password?.length);
    },
);

Then('the password field is empty', async () => {
    expect(await signInPage.passwordField.getText()).toBe('');
});

Then('the password field is masked', async () => {
    expect(await signInPage.passwordField.getAttribute('password')).toBe('true');
});

Then('the email field shows its trimmed value', async function (this: CatchRecordWorld) {
    if (this.email === undefined) {
        throw new Error('No email was entered before checking its trimmed value.');
    }
    expect(await signInPage.emailField.getText()).toBe(this.email.trim());
});

Then('the create account instructions are hidden', async () => {
    await expect(signInPage.vesselOwnerInstructions).not.toBeDisplayed();
    await expect(signInPage.skipperOrAgentInstructions).not.toBeDisplayed();
});

Then('the sign-in button is displayed', async () => {
    await expect(signInPage.signInButton).toBeDisplayed();
});
