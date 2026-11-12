import allure from '@wdio/allure-reporter';

const timestamp = () => new Date().toISOString();

function write(stream: NodeJS.WriteStream, level: string, message: string): void {
    stream.write(`[${timestamp()}] ${level} ${message}\n`);
}

export function logInfo(message: string): void {
    write(process.stdout, 'INFO', message);
}

export function logStep(message: string): void {
    write(process.stdout, 'STEP', message);
    void allure.addStep(message);
}

export function logWarn(message: string): void {
    write(process.stderr, 'WARN', message);
}

export function logError(message: string): void {
    write(process.stderr, 'ERROR', message);
}
