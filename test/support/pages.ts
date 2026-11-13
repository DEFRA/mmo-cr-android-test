import type { BasePage } from '../page-objects/base/basePage';
import catchAreaPage from '../page-objects/catchAreaPage';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
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
import signInPage from '../page-objects/signInPage';
import speciesPage from '../page-objects/speciesPage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import tripEndDatePage from '../page-objects/tripEndDatePage';
import tripStartDatePage from '../page-objects/tripStartDatePage';
import tripTodayPage from '../page-objects/tripTodayPage';

type Element = ReturnType<typeof $>;

export interface PageDefinition {
    page: BasePage;
    heading: () => Element;
    validationError?: () => Element;
    scrollToHeading?: boolean;
}

const pages = {
    'sign in': { page: signInPage, heading: () => signInPage.heading },
    home: { page: homePage, heading: () => homePage.heading },
    'select vessel': { page: selectVesselPage, heading: () => selectVesselPage.heading },
    'trip today': { page: tripTodayPage, heading: () => tripTodayPage.heading },
    'trip start date': { page: tripStartDatePage, heading: () => tripStartDatePage.heading },
    'trip end date': { page: tripEndDatePage, heading: () => tripEndDatePage.heading },
    'departure port': { page: departurePortPage, heading: () => departurePortPage.heading },
    'return port': { page: returnPortPage, heading: () => returnPortPage.heading },
    gear: { page: gearPage, heading: () => gearPage.heading },
    'gear measurement': {
        page: gearMeasurementPage,
        heading: () => gearMeasurementPage.heading,
    },
    'selected gears': { page: selectedGearsPage, heading: () => selectedGearsPage.heading },
    'catch area': { page: catchAreaPage, heading: () => catchAreaPage.heading },
    'catch sub area': { page: catchSubAreaPage, heading: () => catchSubAreaPage.heading },
    species: { page: speciesPage, heading: () => speciesPage.heading },
    'selected species': { page: selectedSpeciesPage, heading: () => selectedSpeciesPage.heading },
    'delayed landing': { page: delayedLandingPage, heading: () => delayedLandingPage.heading },
    'catch record summary': {
        page: catchRecordSummaryPage,
        heading: () => catchRecordSummaryPage.heading,
    },
    'submission success': {
        page: submissionSuccessPage,
        heading: () => submissionSuccessPage.heading,
    },
} satisfies Record<string, PageDefinition>;

export type PageName = keyof typeof pages;

export const pageNames = Object.keys(pages) as PageName[];

export function getPage(name: PageName): PageDefinition {
    return pages[name];
}
