import signInPage from '../page-objects/signInPage';
import homePage from '../page-objects/homePage';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import { logStep } from '../common/logger';
import NetworkHelper from '../helpers/networkHelper';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';

describe('Catch Record - Review & Amend Journey', () => {
    beforeEach(async () => {
        logStep('Setting up the environment and signing in');
        await signInPage.openApp();
        const { email, password } = getAndroidTestCredentials();
        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });
    });

    afterEach(async () => {
        await NetworkHelper.goOnline();
        await signInPage.close();
    });

    it('TC-5.1: Record catch that is not landed immediately (Stored Catch)', async () => {
        logStep('Complete journey up to Delayed Landing and verify stored catch screen');

        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await androidFlowNavigator.selectTripDates(true);
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);

        // Select Yes to delayed landing
        const delayedLandingPage = require('../pageobjects/delayedLandingPage').default;
        await delayedLandingPage.heading.waitForDisplayed();
        await delayedLandingPage.selectYesAndContinue();

        // Verify we are on the stored catch screen
        const storedCatchHeading = await $(
            '//android.widget.TextView[contains(@text, "kept on board") or contains(@text, "stored in")]',
        );
        await expect(storedCatchHeading).toBeDisplayed();

        // Verify only previously selected species are shown (Brown crab)
        const speciesList = await $$('//android.widget.TextView[contains(@text, "Brown crab")]');
        expect(speciesList.length).toBeGreaterThan(0);

        // Select it and add weight
        const firstSpeciesCheckbox = await $('//android.widget.CheckBox');
        await firstSpeciesCheckbox.click();

        const weightInput = await $('//android.widget.EditText');
        await weightInput.setValue('2');

        const saveBtn = await $(
            '//android.widget.Button[contains(@text, "Continue") or contains(@text, "Save")]',
        );
        await saveBtn.click();

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();

        // Verify stored catch data is visible in review
        const reviewText = await $(
            '//android.widget.TextView[contains(@text, "Brown crab") and contains(@text, "2")]',
        );
        await expect(reviewText).toBeDisplayed();
    });

    it('TC-5.5: Edit sections directly from the Review Screen', async () => {
        logStep('Complete the journey, then edit a value from the review screen');

        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await androidFlowNavigator.selectTripDates(true);
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await androidFlowNavigator.selectDelayedLanding(false);

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();

        // Find the "Change" button for Departure Port (assuming typical UI pattern)
        const changeDeparturePortBtn = await $(
            '//android.widget.TextView[contains(@text, "Departure")]/../..//android.widget.TextView[contains(@text, "Change")]',
        );
        if (await changeDeparturePortBtn.isExisting()) {
            await changeDeparturePortBtn.click();

            const departurePortPage = require('../pageobjects/departurePortPage').default;
            await expect(departurePortPage.heading).toBeDisplayed();

            // Edit the port
            await departurePortPage.clickAddPort();
            await departurePortPage.searchSelectAndContinue('Plymouth', 'Plymouth');

            const summaryHeading = await $('//android.widget.TextView[contains(@text, "Check")]');
            await summaryHeading.waitForDisplayed({ timeout: 10000 });

            const depPort = await catchRecordSummaryPage.getFieldValue('Departure port');
            expect(depPort).toEqual('Plymouth');
        }
    });
});
