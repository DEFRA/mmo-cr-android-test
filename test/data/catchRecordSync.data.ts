export const completedCatchRecordData = {
    vessel: 'ACHILLES',
    tripToday: true,
    ports: {
        departure: 'Hastings',
        return: 'Dover',
    },
    gear: {
        name: 'Seine nets',
        meshSize: 10,
        shots: 10,
    },
    species: {
        name: 'Brown crab (TBC)',
        retainedWeight: 5,
        belowMinimumWeight: 1,
        discardedWeight: 1,
    },
    delayedLanding: false,
};

export type CatchRecordData = typeof completedCatchRecordData;

// Same journey as the online record; records are told apart by their status.
export const offlineCatchRecordData: CatchRecordData = { ...completedCatchRecordData };
