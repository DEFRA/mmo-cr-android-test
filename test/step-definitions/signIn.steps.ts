import { Then, When } from '@wdio/cucumber-framework';
import SignInPage from '../page-objects/signInPage';

interface SignInWorld {
    email?: string;
    password?: string;
}

When('I enter email {string}', async function (this: SignInWorld, email: string) {
    this.email = email;
    await SignInPage.enterEmail(email);
});

When('I enter password {string}', async function (this: SignInWorld, password: string) {
    this.password = password;
    await SignInPage.enterPassword(password);
});

When(
    'I enter an email with a {int} character local part',
    async function (this: SignInWorld, length: number) {
        this.email = `${'a'.repeat(length)}@example.com`;
        await SignInPage.enterEmail(this.email);
    },
);

When('I enter a password of {int} characters', async function (this: SignInWorld, length: number) {
    this.password = 'P'.repeat(length);
    await SignInPage.enterPassword(this.password);
});

When('I open the create an account link', async () => {
    await SignInPage.openCreateAccount();
});

Then('the sign-in controls are displayed', async () => {
    await expect(SignInPage.heading).toBeDisplayed();
    await expect(SignInPage.emailField).toBeDisplayed();
    await expect(SignInPage.passwordField).toBeDisplayed();
    await expect(SignInPage.signInButton).toBeDisplayed();
    await expect(SignInPage.forgottenPasswordLink).toBeDisplayed();
    await expect(SignInPage.createAccountLink).toBeDisplayed();
});

Then('the create account instructions are displayed', async () => {
    await expect(SignInPage.vesselOwnerLabel).toBeDisplayed();
    await expect(SignInPage.vesselOwnerInstructions).toBeDisplayed();
    await expect(SignInPage.skipperOrAgentLabel).toBeDisplayed();
    await expect(SignInPage.skipperOrAgentInstructions).toBeDisplayed();
});

Then('the email field shows the entered email', async function (this: SignInWorld) {
    expect(await SignInPage.emailField.getText()).toBe(this.email);
});

Then('the password field contains the entered password length', async function (this: SignInWorld) {
    // Android masks password text, so only the length is comparable.
    expect((await SignInPage.passwordField.getText())?.length).toBe(this.password?.length);
});

Then('the password field is empty', async () => {
    expect(await SignInPage.passwordField.getText()).toBe('');
});

Then('the sign-in button is displayed', async () => {
    await expect(SignInPage.signInButton).toBeDisplayed();
});
