import { logInfo } from '../common/logger';
export function getAndroidTestCredentials(): { email: string; password: string } {
    logInfo('Loading Android test credentials');
    const email = process.env.ANDROID_TEST_EMAIL || 'test@example.com';
    const password = process.env.ANDROID_TEST_PASSWORD || 'password123';

    return { email, password };
}
