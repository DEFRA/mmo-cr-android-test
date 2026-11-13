import { logStep } from '../common/logger';

// Uses the driver's built-in toggle, which does not need Appium's insecure adb_shell feature.
export class NetworkHelper {
    static async goOffline() {
        logStep('Going OFFLINE (Enabling airplane mode)');
        await driver.execute('mobile: setConnectivity', { airplaneMode: true });
    }

    static async goOnline() {
        logStep('Going ONLINE (Disabling airplane mode)');
        // Re-enable Wi-Fi and data too, in case the device left them off after airplane mode.
        await driver.execute('mobile: setConnectivity', {
            airplaneMode: false,
            wifi: true,
            data: true,
        });
    }
}

export default NetworkHelper;
