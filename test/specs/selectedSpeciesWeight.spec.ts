import signInPage from '../page-objects/signInPage';
import homePage from '../page-objects/homePage';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import speciesPage from '../page-objects/speciesPage';
import selectedSpeciesPage from '../page-objects/selectedSpeciesPage';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import { logStep } from '../common/logger';
import { formatDate } from '../common/dateHelper';

describe('Selected Species Weight Validations', () => {
    beforeEach(async () => {
        logStep('Setting up catch record to reach selected species page');
        await signInPage.openApp();
        const { email, password } = getAndroidTestCredentials();
        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });

        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');

        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        await androidFlowNavigator.selectTripDates(
            false,
            formatDate(twoDaysAgo),
            formatDate(today),
        );

        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('38E95');

        await speciesPage.heading.waitForDisplayed();
        await speciesPage.searchSelectAndContinue('br', 'Brown crab (TBC)');
        await selectedSpeciesPage.heading.waitForDisplayed();
    });

    afterEach(async () => {
        await signInPage.close();
    });

    it('validates all weight entry requirements (Acceptance Criteria 1-11)', async () => {
        logStep('AC1: Enter Catch Weight & AC2: Optional weights');
        await selectedSpeciesPage.selectSpeciesCheckbox('Brown crab (TBC)');

        await expect(selectedSpeciesPage.retainedWeightField).toBeDisplayed();

        await selectedSpeciesPage.clickAddBelowMinWeight();
        await expect(selectedSpeciesPage.belowMinWeightField).toBeDisplayed();

        await selectedSpeciesPage.clickAddDiscardedWeight();
        await expect(selectedSpeciesPage.discardedWeightField).toBeDisplayed();

        logStep('AC6: blank Weight above minimum size retained');
        await selectedSpeciesPage.retainedWeightField.clearValue();
        await selectedSpeciesPage.saveAndContinue();
        const blankError = await $(
            '//android.widget.TextView[contains(@text, "Enter the Weight above minimum")]',
        );
        await expect(blankError).toBeDisplayed();

        logStep('AC7: Weight legally discarded higher than Weight above minimum size retained');
        await selectedSpeciesPage.enterRetainedWeight('5');
        await selectedSpeciesPage.enterDiscardedWeight('10');
        await selectedSpeciesPage.saveAndContinue();
        const higherDiscardedError = await $(
            '//android.widget.TextView[contains(@text, "must be higher then Weight legally discarded")]',
        );
        await expect(higherDiscardedError).toBeDisplayed();

        logStep('AC8: entering weight incorrectly (two decimal places)');
        await selectedSpeciesPage.enterDiscardedWeight('');
        await selectedSpeciesPage.enterRetainedWeight('10.55');
        await selectedSpeciesPage.saveAndContinue();
        const decimalError = await $(
            '//android.widget.TextView[contains(@text, "must be a number with up to one decimal place") or contains(@text, "must be a whole number")]',
        );
        await expect(decimalError).toBeDisplayed();

        logStep('Scenario 9: catch weight limit 0');
        await selectedSpeciesPage.enterRetainedWeight('0');
        await selectedSpeciesPage.saveAndContinue();
        const zeroError = await $(
            '//android.widget.TextView[contains(@text, "must be a more the 0KG") or contains(@text, "must be more than 0kg")]',
        );
        await expect(zeroError).toBeDisplayed();

        logStep('Scenario 10: catch weight limit 10,000');
        await selectedSpeciesPage.enterRetainedWeight('10001');
        await selectedSpeciesPage.saveAndContinue();
        const limitError = await $(
            '//android.widget.TextView[contains(@text, "must be a 10,000 or less")]',
        );
        await expect(limitError).toBeDisplayed();

        logStep('Scenario 11: entering weight with minus or letters');
        await selectedSpeciesPage.enterRetainedWeight('-5');
        await selectedSpeciesPage.saveAndContinue();
        await expect(zeroError).toBeDisplayed(); // Same error as <= 0

        await selectedSpeciesPage.enterRetainedWeight('abc');
        await selectedSpeciesPage.saveAndContinue();
        const letterError = await $(
            '//android.widget.TextView[contains(@text, "must be a number")]',
        );
        await expect(letterError).toBeDisplayed();

        logStep('AC3: Edit Weights');
        await selectedSpeciesPage.enterRetainedWeight('5.5');
        await selectedSpeciesPage.enterBelowMinWeight('2');
        await selectedSpeciesPage.enterDiscardedWeight('1');
        await selectedSpeciesPage.saveAndContinue();

        const delayedLandingHeading = await $(
            '//android.widget.TextView[contains(@text, "Are you delaying the landing")]',
        );
        await expect(delayedLandingHeading).toBeDisplayed();
    });

    it('verifies add and remove species functions (AC4 & AC5)', async () => {
        logStep('AC4: add species function');
        await selectedSpeciesPage.clickAddSpecies();
        await expect(speciesPage.heading).toBeDisplayed();

        await speciesPage.searchSelectAndContinue('Atlantic cod', 'Atlantic cod');
        await expect(selectedSpeciesPage.heading).toBeDisplayed();

        logStep('AC5: remove species function');
        await selectedSpeciesPage.clickRemoveSpecies();
        const removeHeading = await $('//android.widget.TextView[contains(@text, "Remove")]');
        await removeHeading.waitForDisplayed({ timeout: 10000 });
        await expect(removeHeading).toBeDisplayed();
    });
});
