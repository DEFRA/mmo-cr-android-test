const timestamp = () => new Date().toISOString();

export async function logInfo(message: string): Promise<void> {
    console.info(`[${timestamp()}] INFO ${message}`);
}

export function logStep(message: string): void {
    console.info(`[${timestamp()}] STEP ${message}`);
}

export function logWarn(message: string): void {
    console.warn(`[${timestamp()}] WARN ${message}`);
}
