import { Then, When } from '@wdio/cucumber-framework';
import speciesPage from '../page-objects/speciesPage';
import selectedSpeciesPage from '../page-objects/selectedSpeciesPage';

When('I search {string} and add species {string}', async (searchText: string, species: string) => {
    await speciesPage.heading.waitForDisplayed();
    await speciesPage.searchSelectAndContinue(searchText, species);
    await selectedSpeciesPage.heading.waitForDisplayed();
});

When('I select the species {string}', async (species: string) => {
    await selectedSpeciesPage.selectSpeciesCheckbox(species);
});

When('I add a below minimum size weight', async () => {
    await selectedSpeciesPage.clickAddBelowMinWeight();
});

When('I add a legally discarded weight', async () => {
    await selectedSpeciesPage.clickAddDiscardedWeight();
});

When('I clear the retained weight', async () => {
    await selectedSpeciesPage.retainedWeightField.clearValue();
});

When('I enter a retained weight of {string}', async (weight: string) => {
    await selectedSpeciesPage.enterRetainedWeight(weight);
});

When('I enter a below minimum size weight of {string}', async (weight: string) => {
    await selectedSpeciesPage.enterBelowMinWeight(weight);
});

When('I enter a legally discarded weight of {string}', async (weight: string) => {
    await selectedSpeciesPage.enterDiscardedWeight(weight);
});

When('I choose to add another species', async () => {
    await selectedSpeciesPage.clickAddSpecies();
});

When('I choose to remove a species', async () => {
    await selectedSpeciesPage.clickRemoveSpecies();
});

Then('the retained weight field is displayed', async () => {
    await expect(selectedSpeciesPage.retainedWeightField).toBeDisplayed();
});

Then('the below minimum size weight field is displayed', async () => {
    await expect(selectedSpeciesPage.belowMinWeightField).toBeDisplayed();
});

Then('the legally discarded weight field is displayed', async () => {
    await expect(selectedSpeciesPage.discardedWeightField).toBeDisplayed();
});

Then('the species search screen is displayed', async () => {
    await expect(speciesPage.heading).toBeDisplayed();
});

Then('the selected species screen is displayed', async () => {
    await expect(selectedSpeciesPage.heading).toBeDisplayed();
});
