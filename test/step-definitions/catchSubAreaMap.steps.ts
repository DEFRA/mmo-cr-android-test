import { Then, When } from '@wdio/cucumber-framework';
import catchAreaPage from '../page-objects/catchAreaPage';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import speciesPage from '../page-objects/speciesPage';

let selectedAreaCode: string | null = null;
let mapSnapshot = '';

When(/^I zoom (in|out) on the map$/, async (direction: 'in' | 'out') => {
    mapSnapshot = await catchAreaPage.getMapSnapshot();
    await catchAreaPage.zoomMap(direction);
});

When(
    /^I drag the map (up|down|left|right)$/,
    async (direction: 'up' | 'down' | 'left' | 'right') => {
        mapSnapshot = await catchAreaPage.getMapSnapshot();
        for (let i = 0; i < 3; i++) {
            await catchAreaPage.dragMap(direction);
        }
    },
);

Then('the map view changes', async () => {
    expect(await catchAreaPage.getMapSnapshot()).not.toEqual(mapSnapshot);
});

async function selectAreaOnMap() {
    await catchAreaPage.selectLocation();
    selectedAreaCode = await catchAreaPage.getSelectedAreaCode();
    expect(selectedAreaCode).toBeTruthy();
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

Then('the selected area is highlighted', async () => {
    expect(await catchAreaPage.getSelectedAreaCode()).toEqual(selectedAreaCode);
});

Then('the corresponding list item is selected', async () => {
    const areaCode = selectedAreaCode;
    if (areaCode === null) {
        throw new Error('No statistical sub area has been selected');
    }
    expect(await catchAreaPage.isSelectedAreaTextDisplayed(areaCode)).toBe(true);
});

Then('I proceed to the next step of the catch recording journey', async () => {
    await expect(speciesPage.heading).toBeDisplayed();
});

Then('the selected statistical sub area is attached to the catch record', async () => {
    await expect(catchRecordSummaryPage.heading).toBeDisplayed();
    const areaCodeValue = selectedAreaCode;
    if (areaCodeValue === null) {
        throw new Error('No statistical sub area has been selected');
    }
    await catchRecordSummaryPage.scrollToText(areaCodeValue);
    await expect(catchRecordSummaryPage.textContaining(areaCodeValue)).toBeDisplayed();
});
