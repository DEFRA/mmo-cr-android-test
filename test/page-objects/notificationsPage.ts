import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class NotificationsPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Notifications"]');
    }
}

export default new NotificationsPage();
