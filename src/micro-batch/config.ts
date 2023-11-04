/**
 * timeWindow: is in milliseconds
 */
export const config = {
    capacity: (process.env.BATCH_CAPACITY || 10) as number,
    timeWindow: (process.env.BATCH_TIME_WINDOW || 1000) as number,
    strategy: process.env.STRATEGY || 'capacity-window',
};
