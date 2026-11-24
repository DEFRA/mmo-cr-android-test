import { Then, When } from '@wdio/cucumber-framework';
import catchAreaPage from '../page-objects/catchAreaPage';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import speciesPage from '../page-objects/speciesPage';
import type { CatchRecordWorld } from '../support/world';

function selectedAreaCode(world: CatchRecordWorld): string {
    if (!world.selectedMapAreaCode) {
        throw new Error('No statistical sub area has been selected');
    }
    return world.selectedMapAreaCode;
}

When(
    /^I zoom (in|out) on the map$/,
    async function (this: CatchRecordWorld, direction: 'in' | 'out') {
        this.mapSnapshot = await catchAreaPage.getMapSnapshot();
        await catchAreaPage.zoomMap(direction);
    },
);

When(
    /^I drag the map (up|down|left|right)$/,
    async function (this: CatchRecordWorld, direction: 'up' | 'down' | 'left' | 'right') {
        this.mapSnapshot = await catchAreaPage.getMapSnapshot();
        for (let i = 0; i < 3; i++) {
            await catchAreaPage.dragMap(direction);
        }
    },
);

Then('the map view changes', async function (this: CatchRecordWorld) {
    expect(await catchAreaPage.getMapSnapshot()).not.toEqual(this.mapSnapshot);
});

async function selectAreaOnMap(this: CatchRecordWorld) {
    await catchAreaPage.selectLocation();
    this.selectedMapAreaCode = await catchAreaPage.getSelectedAreaCode();
    expect(this.selectedMapAreaCode).toBeTruthy();
}

When('I select a statistical sub area on the map', selectAreaOnMap);

When('I have selected a statistical sub area', selectAreaOnMap);

When('I select Save and Continue', async () => {
    await catchAreaPage.saveAndContinue();
});

When('I select Save and Continue without selecting an area', async () => {
    expect(await catchAreaPage.isAreaSelected()).toBe(false);
    await catchAreaPage.saveAndContinue();
});

Then('the selected area is highlighted', async function (this: CatchRecordWorld) {
    expect(await catchAreaPage.getSelectedAreaCode()).toEqual(selectedAreaCode(this));
});

Then('the corresponding list item is selected', async function (this: CatchRecordWorld) {
    expect(await catchAreaPage.isSelectedAreaTextDisplayed(selectedAreaCode(this))).toBe(true);
});

Then('I proceed to the next step of the catch recording journey', async () => {
    await expect(speciesPage.heading).toBeDisplayed();
});

Then(
    'the selected statistical sub area is attached to the catch record',
    async function (this: CatchRecordWorld) {
        await expect(catchRecordSummaryPage.heading).toBeDisplayed();
        const areaCode = selectedAreaCode(this);
        await catchRecordSummaryPage.scrollToText(areaCode);
        await expect(catchRecordSummaryPage.textContaining(areaCode)).toBeDisplayed();
    },
);
