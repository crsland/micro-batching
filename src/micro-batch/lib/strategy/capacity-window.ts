import { JobData } from 'src/micro-batch/job/job';
import { BatchStrategyInterface } from './batch-strategy.interface';

/**
 * @class CapacityWindow
 * 
 * In this case, we create micro batches based on a certain capacity defined in configuration
 */
export class CapacityWindow implements BatchStrategyInterface {

    capacity: number;
    private currentBatch: JobData[];
    private isBatchReadyToBeUsed: boolean;

    constructor () {
        this.currentBatch = [];
        this.isBatchReadyToBeUsed = false;
    }

    public prepareBatch(jobData: JobData): void {
        this.currentBatch.push(jobData);
        this.isBatchReadyToBeUsed = !(this.currentBatch.length < this.capacity);
        return;
    }

    public flush() {
        const batch = this.currentBatch;
        this.currentBatch = [];
        return batch;
    }

    public isBatchReady(): boolean {
        return this.isBatchReadyToBeUsed;
    }

    public getMicroBatch (): JobData[] {
        const microBatch = this.currentBatch;
        // reset batch, so we can calculate the next one
        this.currentBatch = [];
        this.isBatchReadyToBeUsed = false;
        return microBatch;
    }
}
