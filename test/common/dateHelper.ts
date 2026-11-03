import type { DateData } from '../helpers/androidFlowNavigator';

export function formatDate(date: Date): DateData {
    return {
        day: String(date.getDate()).padStart(2, '0'),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        year: String(date.getFullYear()),
    };
}
