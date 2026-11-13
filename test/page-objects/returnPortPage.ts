import { BasePortPage } from './base/basePortPage';

export class ReturnPortPage extends BasePortPage {
    get heading() {
        return $(
            '//android.widget.TextView[@heading="true" and (@text="Enter the port or closest port you returned to" or @text="Select the port you returned to")]',
        );
    }
}

export default new ReturnPortPage();
