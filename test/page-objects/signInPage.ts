import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

export class SignInPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Sign in" and @heading="true"]');
    }

    get emailLabel() {
        return $('//android.view.View[@content-desc="Email address"]');
    }

    get passwordLabel() {
        return $('//android.view.View[@content-desc="Password"]');
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

    get forgottenPasswordLink() {
        return $('//android.widget.Button[@text="Forgotten your password?"]');
    }

    get helpHeading() {
        return $('//android.widget.TextView[@text="Having trouble signing in?"]');
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
        await this.emailField.waitForDisplayed();
        await this.emailField.setValue(email);
    }

    async enterPassword(password: string) {
        logStep('Entering password');
        await this.passwordField.waitForDisplayed();
        await this.passwordField.setValue(password);
    }

    async signIn(email: string, password: string) {
        logStep('Signing in');
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.submitSignInForm();
    }

    async submitSignInForm() {
        logStep('Submitting sign-in form');
        await this.signInButton.click();
    }

    async openCreateAccount() {
        logStep('Opening create account link');
        await this.createAccountLink.waitForDisplayed();
        await this.createAccountLink.click();
    }
}

export default new SignInPage();
