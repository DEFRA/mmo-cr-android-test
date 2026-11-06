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

// The map exposes its highlighted area through its accessibility description.
Then('the selected area is highlighted', async () => {
    expect(await catchAreaPage.getSelectedAreaCode()).toEqual(selectedAreaCode);
});

Then('the corresponding list item is selected', async () => {
    expect(await catchAreaPage.isSelectedAreaTextDisplayed(selectedAreaCode!)).toBe(true);
});

Then('I proceed to the next step of the catch recording journey', async () => {
    await expect(speciesPage.heading).toBeDisplayed();
});

Then('the selected statistical sub area is attached to the catch record', async () => {
    await expect(catchRecordSummaryPage.heading).toBeDisplayed();
    const areaCode = $(`//android.widget.TextView[contains(@text, "${selectedAreaCode}")]`);
    await catchRecordSummaryPage.scrollUntilDisplayed(areaCode, { maxSwipes: 10 });
    await expect(areaCode).toBeDisplayed();
});
