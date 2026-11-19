import { BaseYesNoPage } from './base/baseYesNoPage';

// TODO(CRAR-165): stub page for the mandatory "retained catch" single-choice question (AC01).
// Confirm the heading text and where the question sits in the journey against the app.
export class RetainedCatchPage extends BaseYesNoPage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="TODO(CRAR-165): retained catch heading" and @heading="true"]',
        );
    }
}

export default new RetainedCatchPage();
