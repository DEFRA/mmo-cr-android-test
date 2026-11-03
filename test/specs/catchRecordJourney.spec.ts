import signInPage from '../page-objects/signInPage';
import homePage from '../page-objects/homePage';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import NetworkHelper from '../helpers/networkHelper';
import { logStep, logInfo } from '../common/logger';
import { formatDate } from '../common/dateHelper';

describe('Catch Record End-to-End Journey', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await signInPage.openApp();
    });

    afterEach(async () => {
        logStep('afterEach');
        await NetworkHelper.goOnline();
        await signInPage.close();
    });

    it('should successfully complete a catch record (Happy Path)', async () => {
        logStep('should successfully complete a catch record (Happy Path)');
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

        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);

        await androidFlowNavigator.selectDelayedLanding(false);

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();

        const vessel = await catchRecordSummaryPage.getFieldValue('Vessel');
        expect(vessel).toEqual('ACHILLES');

        const depPort = await catchRecordSummaryPage.getFieldValue('Departure port');
        expect(depPort).toEqual('Hastings');

        await catchRecordSummaryPage.acceptAndSubmit();

        await expect(submissionSuccessPage.heading).toBeDisplayed();

        const referenceId = await submissionSuccessPage.getRecordReference();
        expect(referenceId).toBeTruthy();
        logInfo(`Successfully created catch record with reference: ${referenceId}`);

        await submissionSuccessPage.clickViewRecords();
        await expect(homePage.heading).toBeDisplayed();
    });

    it('should successfully complete a catch record (Offline Happy Path)', async () => {
        logStep('should successfully complete a catch record (Offline Happy Path)');
        const { email, password } = getAndroidTestCredentials();

        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });

        await NetworkHelper.goOffline();

        await androidFlowNavigator.startCatchRecord();

        await androidFlowNavigator.selectVessel('ACHILLES');

        await androidFlowNavigator.selectTripDates(true);
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await androidFlowNavigator.selectDelayedLanding(false);

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();
        await catchRecordSummaryPage.acceptAndSubmit();

        const isOfflineBannerVisible = await submissionSuccessPage.isOfflineBannerDisplayed();
        expect(isOfflineBannerVisible).toBe(true);

        const referenceId = await submissionSuccessPage.getRecordReference();
        expect(referenceId).toBeTruthy();
        logInfo(`Successfully created offline catch record with reference: ${referenceId}`);

        await submissionSuccessPage.clickViewRecords();
        await expect(homePage.heading).toBeDisplayed();
    });
});
