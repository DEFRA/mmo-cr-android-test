import signInPage from '../page-objects/signInPage';
import homePage from '../page-objects/homePage';
import selectVesselPage from '../page-objects/selectVesselPage';
import tripTodayPage from '../page-objects/tripTodayPage';
import tripStartDatePage from '../page-objects/tripStartDatePage';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import { logStep } from '../common/logger';
import NetworkHelper from '../helpers/networkHelper';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import catchAreaPage from '../page-objects/catchAreaPage';
import catchSubAreaPage from '../page-objects/catchSubAreaPage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import gearPage from '../page-objects/gearPage';
import gearMeasurementPage from '../page-objects/gearMeasurementPage';

describe('Catch Record Business Rules & Offline Handling', () => {
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

    it('Mandatory Single-Choice Questions (Vessel Selection)', async () => {
        logStep('Testing mandatory single-choice question constraint');
        await androidFlowNavigator.startCatchRecord();
        await selectVesselPage.heading.waitForDisplayed();

        await selectVesselPage.saveAndContinue();

        const errorMsg = await $(
            '//android.widget.TextView[contains(@text, "problem") or contains(@text, "Select")]',
        );
        await expect(errorMsg).toBeDisplayed();
    });

    it('Restrict Historical Trip Dates (365 days limit)', async () => {
        logStep('Testing historical trip date restriction (365 days limit)');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');

        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectNo();

        await tripStartDatePage.heading.waitForDisplayed();

        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 366);

        await tripStartDatePage.enterDateAndContinue(
            oldDate.getDate().toString(),
            (oldDate.getMonth() + 1).toString(),
            oldDate.getFullYear().toString(),
        );

        const dateError = await $(
            '//android.widget.TextView[contains(@text, "365") or contains(@text, "past")]',
        );
        await expect(dateError).toBeDisplayed();
    });

    it('Display Suggested Statistical Areas and Allow "Other"', async () => {
        logStep('Testing map statistical areas and Other selection');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectYes();
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);

        await catchAreaPage.heading.waitForDisplayed();

        await expect(catchAreaPage.map).toBeDisplayed();

        await catchAreaPage.clickOtherAndContinue();
        await expect(catchSubAreaPage.heading).toBeDisplayed();
    });

    xit('Save and Maintain Favourites', async () => {
        logStep('Testing favourites for ports, gear, and species');
    });

    it('Late Submission Warning (Trip > 24 hours ago)', async () => {
        logStep('Testing late submission warning');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');

        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectNo();

        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 3);

        await tripStartDatePage.enterDateAndContinue(
            oldDate.getDate().toString(),
            (oldDate.getMonth() + 1).toString(),
            oldDate.getFullYear().toString(),
        );

        const endDatePageHeading = await $('//android.widget.TextView[contains(@text, "end")]');
        await endDatePageHeading.waitForDisplayed();
        await tripStartDatePage.enterDateAndContinue(
            oldDate.getDate().toString(),
            (oldDate.getMonth() + 1).toString(),
            oldDate.getFullYear().toString(),
        );

        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('Other', '38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await androidFlowNavigator.selectDelayedLanding(false);

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();
        await catchRecordSummaryPage.acceptAndSubmit();

        const warningMessage = await $(
            '//android.widget.TextView[contains(@text, "review the trip end date") or contains(@text, "warning")]',
        );
        await expect(warningMessage).toBeDisplayed();

        const acknowledgeBtn = await $('//android.widget.Button[contains(@text, "Submit")]');
        if (await acknowledgeBtn.isDisplayed()) {
            await acknowledgeBtn.click();
            await expect(submissionSuccessPage.heading).toBeDisplayed();
        }
    });

    it('Retain Records When Offline and Retry Submission', async () => {
        logStep('Testing offline record retention and submission retry');
        await NetworkHelper.goOffline();

        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectYes();
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('Other', '38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await androidFlowNavigator.selectDelayedLanding(false);

        await catchRecordSummaryPage.acceptAndSubmit();

        const offlineBanner = await submissionSuccessPage.offlineBanner;
        await expect(offlineBanner).toBeDisplayed();

        await submissionSuccessPage.clickViewRecords();

        const statusNotSubmitted = await $(
            '//android.widget.TextView[@text="Complete Not Submitted"]',
        );
        await expect(statusNotSubmitted).toBeDisplayed();

        await NetworkHelper.goOnline();
        await browser.pause(5000);

        const statusSubmitted = await $('//android.widget.TextView[@text="Submitted"]');
        await expect(statusSubmitted).toBeDisplayed();
    });

    xit('Auto-Save Draft Records and Prevent Data Loss', async () => {
        logStep('Testing auto-save draft functionality');
    });

    xit('Duplicate Submission and Conflict Resolution', async () => {
        logStep('Testing duplicate submission and conflict rules');
    });
    it('Invalid Trip Dates (Return date before departure date)', async () => {
        logStep('TC-2.5: Testing return date earlier than departure date');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');

        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectNo();

        await tripStartDatePage.heading.waitForDisplayed();

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        await tripStartDatePage.enterDateAndContinue(
            today.getDate().toString(),
            (today.getMonth() + 1).toString(),
            today.getFullYear().toString(),
        );

        const endDatePageHeading = await $('//android.widget.TextView[contains(@text, "end")]');
        await endDatePageHeading.waitForDisplayed();

        // The tripStartDatePage page object method is likely reused for end date input
        await tripStartDatePage.enterDateAndContinue(
            yesterday.getDate().toString(),
            (yesterday.getMonth() + 1).toString(),
            yesterday.getFullYear().toString(),
        );

        const dateError = await $(
            '//android.widget.TextView[contains(@text, "before") or contains(@text, "cannot be earlier") or contains(@text, "after")]',
        );
        await expect(dateError).toBeDisplayed();
    });

    it('Invalid Gear Measurements (Decimals and Negatives)', async () => {
        logStep('TC-3.3: Testing invalid gear measurements');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectYes();
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');

        await gearPage.heading.waitForDisplayed();
        await gearPage.searchSelectAndContinue('Seine nets', 'Seine nets');

        await gearMeasurementPage.heading.waitForDisplayed();

        await gearMeasurementPage.enterMeshSizeAndContinue('10.5');

        const decimalError = await $('//android.widget.TextView[contains(@text, "whole number")]');
        await expect(decimalError).toBeDisplayed();

        // Cannot clear using page object directly if the method clicks continue, but we'll try to find input and clear
        const inputField = await $('//android.widget.EditText');
        await inputField.clearValue();
        await inputField.setValue('-5');
        const continueBtn = await $(
            '//android.widget.Button[contains(@text, "Continue") or contains(@text, "Save")]',
        );
        await continueBtn.click();

        const negativeError = await $(
            '//android.widget.TextView[contains(@text, "cannot be negative") or contains(@text, "more than 0")]',
        );
        await expect(negativeError).toBeDisplayed();
    });
});
