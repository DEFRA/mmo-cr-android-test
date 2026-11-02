import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class SignInPage extends BasePage {
    get crownLogo() {
        return $('~GOV.UK Crown Logo');
    }

    get heading() {
        return $('//android.widget.TextView[@text="Sign in" and @heading="true"]');
    }

    get emailField() {
        return $('//android.widget.EditText[@password="false"]');
    }

    get passwordField() {
        return $('//android.widget.EditText[@password="true"]');
    }

    get signInButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Sign in"]]',
        );
    }

    get troubleSigningInText() {
        return $('//android.widget.TextView[@text="Having trouble signing in?"]');
    }

    get forgottenPasswordLink() {
        return $('//android.widget.TextView[@text="Forgotten your password?"]');
    }

    get createAccountLink() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Create an account"]]',
        );
    }

    get vesselOwnerLabel() {
        return $('//android.widget.TextView[@text="Vessel owner:"]');
    }

    get vesselOwnerInstructions() {
        return $(
            '//android.widget.TextView[contains(@text, "You will receive an email invitation to register")]',
        );
    }

    get skipperOrAgentLabel() {
        return $('//android.widget.TextView[@text="Skipper or agent:"]');
    }

    get skipperOrAgentInstructions() {
        return $('//android.widget.TextView[contains(@text, "Ask your vessel owner to add you")]');
    }

    async enterEmail(email: string) {
        logStep('Entering email ' + email.substring(0, 3) + '***');
        await this.emailField.waitForDisplayed({ timeout: 10000 });
        await this.emailField.setValue(email);
    }

    async enterPassword(password: string) {
        logStep('Entering password');
        await this.passwordField.waitForDisplayed({ timeout: 10000 });
        await this.passwordField.setValue(password);
    }

    async signIn(email: string, password: string) {
        logStep('Signing in');
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.signInButton.click();
    }

    async openForgottenPassword() {
        logStep('Opening forgotten password link');
        await this.forgottenPasswordLink.waitForDisplayed({ timeout: 10000 });
        await this.forgottenPasswordLink.click();
    }

    async openCreateAccount() {
        logStep('Opening create account link');
        await this.createAccountLink.waitForDisplayed({ timeout: 10000 });
        await this.createAccountLink.click();
    }
}

export default new SignInPage();
