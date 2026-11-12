import { Then, When } from '@wdio/cucumber-framework';
import signInPage from '../page-objects/signInPage';
import type { CatchRecordWorld } from '../support/world';

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

Then('the sign-in controls are displayed', async () => {
    await expect(signInPage.heading).toBeDisplayed();
    await expect(signInPage.emailField).toBeDisplayed();
    await expect(signInPage.passwordField).toBeDisplayed();
    await expect(signInPage.signInButton).toBeDisplayed();
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
        // Android masks password text, so only the length is comparable.
        expect((await signInPage.passwordField.getText()).length).toBe(this.password?.length);
    },
);

Then('the password field is empty', async () => {
    expect(await signInPage.passwordField.getText()).toBe('');
});

Then('the sign-in button is displayed', async () => {
    await expect(signInPage.signInButton).toBeDisplayed();
});
