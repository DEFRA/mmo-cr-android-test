import catchAreaPage from '../page-objects/catchAreaPage';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import catchSubAreaPage from '../page-objects/catchSubAreaPage';
import delayedLandingPage from '../page-objects/delayedLandingPage';
import departurePortPage from '../page-objects/departurePortPage';
import gearMeasurementPage from '../page-objects/gearMeasurementPage';
import gearPage from '../page-objects/gearPage';
import homePage from '../page-objects/homePage';
import lateSubmissionWarningPage from '../page-objects/lateSubmissionWarningPage';
import removeSpeciesPage from '../page-objects/removeSpeciesPage';
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

const pages = {
    'sign in': () => signInPage.heading,
    home: () => homePage.heading,
    'select vessel': () => selectVesselPage.heading,
    'trip today': () => tripTodayPage.heading,
    'trip start date': () => tripStartDatePage.heading,
    'trip end date': () => tripEndDatePage.heading,
    'departure port': () => departurePortPage.heading,
    'return port': () => returnPortPage.heading,
    gear: () => gearPage.heading,
    'gear measurement': () => gearMeasurementPage.heading,
    'selected gears': () => selectedGearsPage.heading,
    'catch area': () => catchAreaPage.heading,
    'catch sub area': () => catchSubAreaPage.heading,
    species: () => speciesPage.heading,
    'selected species': () => selectedSpeciesPage.heading,
    'remove species': () => removeSpeciesPage.heading,
    'delayed landing': () => delayedLandingPage.heading,
    'catch record summary': () => catchRecordSummaryPage.heading,
    'submission success': () => submissionSuccessPage.heading,
    'late submission warning': () => lateSubmissionWarningPage.heading,
} satisfies Record<string, () => Element>;

export type PageName = keyof typeof pages;

export const pageNames = Object.keys(pages) as PageName[];

export function pageHeading(name: PageName): Element {
    return pages[name]();
}
