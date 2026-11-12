import { logInfo } from '../common/logger';

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable ${name}`);
    }
    return value;
}

export function getAndroidTestCredentials(): { email: string; password: string } {
    logInfo('Loading Android test credentials');
    return {
        email: requireEnv('ANDROID_TEST_EMAIL'),
        password: requireEnv('ANDROID_TEST_PASSWORD'),
    };
}
