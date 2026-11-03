import SignInPage from '../page-objects/signInPage';
import { logStep } from '../common/logger';

describe('Android sign-in screen', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await SignInPage.openApp();
    });

    afterEach(async () => {
        logStep('afterEach');
        await SignInPage.close();
    });

    it('displays the sign-in controls', async () => {
        logStep('displays the sign-in controls');
        await expect(SignInPage.heading).toBeDisplayed();
        await expect(SignInPage.emailField).toBeDisplayed();
        await expect(SignInPage.passwordField).toBeDisplayed();
        await expect(SignInPage.signInButton).toBeDisplayed();
        await expect(SignInPage.forgottenPasswordLink).toBeDisplayed();
        await expect(SignInPage.createAccountLink).toBeDisplayed();
    });

    it('displays instructions when the create an account link is clicked', async () => {
        logStep('clicking create an account link and verifying instructions appear');
        await expect(SignInPage.createAccountLink).toBeClickable();
        await SignInPage.openCreateAccount();

        await expect(SignInPage.vesselOwnerLabel).toBeDisplayed();
        await expect(SignInPage.vesselOwnerInstructions).toBeDisplayed();
        await expect(SignInPage.skipperOrAgentLabel).toBeDisplayed();
        await expect(SignInPage.skipperOrAgentInstructions).toBeDisplayed();
    });

    it('accepts email and password input', async () => {
        logStep('accepts email and password input');
        await SignInPage.enterEmail('test@example.com');
        await SignInPage.enterPassword('Password123!');

        expect(await SignInPage.emailField.getText()).toBe('test@example.com');
        expect((await SignInPage.passwordField.getText())?.length).toBe(12);
    });

    it('handles empty credentials without losing the sign-in controls', async () => {
        logStep('handles empty credentials without losing the sign-in controls');
        await SignInPage.enterEmail('');
        await SignInPage.enterPassword('');

        expect(await SignInPage.emailField.getText()).toBe('');
        expect(await SignInPage.passwordField.getText()).toBe('');
        await expect(SignInPage.signInButton).toBeDisplayed();
    });

    it('handles whitespace and special characters in credentials', async () => {
        logStep('handles whitespace and special characters in credentials');
        const email = '  test+tag@example.com  ';
        const password = ' P@ss w0rd!#$  ';

        await SignInPage.enterEmail(email);
        await SignInPage.enterPassword(password);

        expect(await SignInPage.emailField.getText()).toBe(email);
        expect((await SignInPage.passwordField.getText())?.length).toBe(password.length);
    });

    it('handles long credential values', async () => {
        logStep('handles long credential values');
        const email = `${'a'.repeat(64)}@example.com`;
        const password = 'P'.repeat(128);

        await SignInPage.enterEmail(email);
        await SignInPage.enterPassword(password);

        expect(await SignInPage.emailField.getText()).toBe(email);
        expect((await SignInPage.passwordField.getText())?.length).toBe(password.length);
    });
});
