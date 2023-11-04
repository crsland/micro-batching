import { JobData } from '../../job/job';

/**
 * @interface BatchStrategyInterface
 */
export interface BatchStrategyInterface {
    capacity: number;
    timeWindow?: number;

    prepareBatch(jobData: JobData): void;
    flush(): JobData[] | any;
    isBatchReady(): boolean;
    getMicroBatch(): JobData[] | any;
}
