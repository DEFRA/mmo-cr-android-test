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

// Uses a different species so the offline record can be told apart from the online one.
export const offlineCatchRecordData: CatchRecordData = {
    ...completedCatchRecordData,
    species: { ...completedCatchRecordData.species, name: 'Zebra seabream' },
};
