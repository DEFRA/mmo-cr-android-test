import { logStep } from '../common/logger';
import catchAreaPage from '../page-objects/catchAreaPage';
import catchSubAreaPage from '../page-objects/catchSubAreaPage';
import delayedLandingPage from '../page-objects/delayedLandingPage';
import departurePortPage from '../page-objects/departurePortPage';
import gearMeasurementPage from '../page-objects/gearMeasurementPage';
import gearPage from '../page-objects/gearPage';
import homePage from '../page-objects/homePage';
import returnPortPage from '../page-objects/returnPortPage';
import selectVesselPage from '../page-objects/selectVesselPage';
import selectedGearsPage from '../page-objects/selectedGearsPage';
import selectedSpeciesPage from '../page-objects/selectedSpeciesPage';
import speciesPage from '../page-objects/speciesPage';
import tripEndDatePage from '../page-objects/tripEndDatePage';
import tripStartDatePage from '../page-objects/tripStartDatePage';
import tripTodayPage from '../page-objects/tripTodayPage';

export type DateData = { day: string; month: string; year: string };

export class AndroidFlowNavigator {
    async startCatchRecord() {
        logStep('Starting catch record journey');
        await homePage.clickCreateRecordButton();
    }

    async selectVessel(vesselName: string) {
        logStep(`Selecting vessel: ${vesselName}`);
        await selectVesselPage.heading.waitForDisplayed();
        await selectVesselPage.selectVessel(vesselName);
    }

    async selectTripDates(tripToday: boolean, startDate?: DateData, endDate?: DateData) {
        logStep(`Selecting trip dates (tripToday: ${tripToday})`);
        await tripTodayPage.heading.waitForDisplayed();

        if (tripToday) {
            await tripTodayPage.selectYes();
        } else {
            if (!startDate || !endDate) {
                throw new Error('Must provide startDate and endDate when tripToday is false');
            }
            await tripTodayPage.selectNo();

            await tripStartDatePage.heading.waitForDisplayed();
            await tripStartDatePage.enterDateAndContinue(
                startDate.day,
                startDate.month,
                startDate.year,
            );

            await tripEndDatePage.heading.waitForDisplayed();
            await tripEndDatePage.enterDateAndContinue(endDate.day, endDate.month, endDate.year);
        }
    }

    async selectPorts(departurePort: string, returnPort: string) {
        logStep(`Selecting ports - Departure: ${departurePort}, Return: ${returnPort}`);

        await departurePortPage.heading.waitForDisplayed();
        await departurePortPage.clickAddPort();
        await departurePortPage.searchSelectAndContinue(departurePort, departurePort);

        await returnPortPage.heading.waitForDisplayed();
        await returnPortPage.clickAddPort();
        await returnPortPage.searchSelectAndContinue(returnPort, returnPort);
    }

    async selectAreas(catchArea?: string, subArea?: string) {
        logStep(`Selecting catch area${catchArea ? `: ${catchArea}` : ' (random)'}`);
        await catchAreaPage.heading.waitForDisplayed();

        if (catchArea === 'Other') {
            await catchAreaPage.clickOtherAndContinue();
            await this.selectSubAreas(subArea);
        } else {
            await catchAreaPage.selectRandomLocationAndContinue();
        }
    }

    async selectSubAreas(subArea?: string) {
        logStep(`Selecting sub area${subArea ? `: ${subArea}` : ' (first available)'}`);
        await catchSubAreaPage.heading.waitForDisplayed();
        if (subArea) {
            await catchSubAreaPage.selectSubAreaAndContinue(subArea);
        } else {
            await catchSubAreaPage.selectFirstSubAreaAndContinue();
        }
    }

    async selectGear(gearName: string, meshSize: string | number, shots: string | number) {
        logStep(`Selecting gear: ${gearName} (mesh: ${meshSize}mm, shots: ${shots})`);
        await gearPage.heading.waitForDisplayed();
        await gearPage.searchSelectAndContinue(gearName, gearName);

        await gearMeasurementPage.heading.waitForDisplayed();
        await gearMeasurementPage.enterMeshSizeAndContinue(meshSize);

        await selectedGearsPage.heading.waitForDisplayed();
        await selectedGearsPage.selectGearCheckbox(gearName);
        await selectedGearsPage.enterShots(shots);
        await selectedGearsPage.saveAndContinue();
    }

    async selectSpecies(
        speciesName: string,
        retainedWeight: string | number,
        belowMinWeight: string | number,
        discardedWeight: string | number,
    ) {
        logStep(
            `Selecting species: ${speciesName} (weights: ${retainedWeight} / ${belowMinWeight} / ${discardedWeight})`,
        );
        await speciesPage.heading.waitForDisplayed();
        const searchText = speciesName.length > 2 ? speciesName.substring(0, 3) : speciesName;
        await speciesPage.searchSelectAndContinue(searchText, speciesName);

        await selectedSpeciesPage.heading.waitForDisplayed();
        await selectedSpeciesPage.selectSpeciesCheckbox(speciesName);
        await selectedSpeciesPage.enterRetainedWeight(retainedWeight);

        await selectedSpeciesPage.clickAddBelowMinWeight();
        await selectedSpeciesPage.enterBelowMinWeight(belowMinWeight);

        await selectedSpeciesPage.clickAddDiscardedWeight();
        await selectedSpeciesPage.enterDiscardedWeight(discardedWeight);

        await selectedSpeciesPage.saveAndContinue();
    }

    async selectDelayedLanding(isDelayed: boolean) {
        logStep(`Selecting delayed landing: ${isDelayed}`);
        await delayedLandingPage.heading.waitForDisplayed();
        if (isDelayed) {
            await delayedLandingPage.selectYesAndContinue();
        } else {
            await delayedLandingPage.selectNoAndContinue();
        }
    }
}

export default new AndroidFlowNavigator();
