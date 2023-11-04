import { BatchStrategyInterface } from './batch-strategy.interface';
import { JobData } from '../../job/job';

export class FixedWindow implements BatchStrategyInterface {

    capacity: number;
    timeWindow: number;

    public isBatchReady(): boolean {
        return false;
    }
    public getMicroBatch() {
        // @todo
    }

    public flush() {
        // @todo
    }

    public prepareBatch(jobData: JobData) {
        console.log(jobData);
        // Empty implementation
        return;
    }
}
