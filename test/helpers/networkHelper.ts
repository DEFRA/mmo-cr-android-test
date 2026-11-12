import { logStep } from '../common/logger';

// Uses the driver's built-in toggle, which does not need Appium's insecure adb_shell feature.
export class NetworkHelper {
    private static async setConnectivity(enabled: boolean) {
        await driver.execute('mobile: setConnectivity', { wifi: enabled, data: enabled });
    }

    static async goOffline() {
        logStep('Going OFFLINE (Disabling Wi-Fi and mobile data)');
        await this.setConnectivity(false);
    }

    static async goOnline() {
        logStep('Going ONLINE (Enabling Wi-Fi and mobile data)');
        await this.setConnectivity(true);
    }
}

export default NetworkHelper;
