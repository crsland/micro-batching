import { JobData } from 'src/micro-batch/job/job';
import { BatchStrategyInterface } from './batch-strategy.interface';

export class SlidingWindow implements BatchStrategyInterface {

    capacity: number;
    timeWindow: number;
    private queue: JobData[];
    private currentBatch: JobData[];
    private isBatchReadyToBeUsed: boolean;

    constructor () {
        this.queue = [];
        this.currentBatch = [];
        this.isBatchReadyToBeUsed = false;
    }

    public prepareBatch(jobData: JobData) {
        const currentTime = Date.now();
        // 1 move the sliding window: Remove elements from the queue that are older than the timeFrame (window)
        // 2 Check if the elements in the queue are less or equal than the capacity we set up:
        // if within capacity: append the new request to the queue and return true
        // else we return false, because the queue is full, we can't allow more request since we throttling
        this.updateQueue(currentTime);        

        if (this.currentBatch.length < this.capacity) {
            console.log(`INFO: batch still within capacity. batch.length: ${this.queue.length} - capacity: ${this.capacity}`);
            this.queue.push(jobData);
            this.currentBatch.push(jobData);    
            this.isBatchReadyToBeUsed = false;
        } else {
            // At this point, the batch has been updated based on time and it is at capacity.
            // That means, it is ready to be used by consumers
            this.isBatchReadyToBeUsed = true;
        }
        // Review what to do in this scenario
        // Review correct functioning of the sliding window as I am burnt out currently
        // Return curated batch based on the last {timeWindow} time period
        return;
    }

    public flush() {
        // @todo
    }

    public isBatchReady(): boolean {
        return this.isBatchReadyToBeUsed;
    }

    public getMicroBatch (): JobData[] {
        const microBatch = this.currentBatch;
        // reset batch, so we can calculate the next one
        this.currentBatch = [];
        this.queue = [];
        this.isBatchReadyToBeUsed = false;
        return microBatch;
    }

    private updateQueue(currentTime: number): void {

        if (!this.queue.length) {
            return;
        }

        let job: JobData = this.queue[0];
        let timeElapsed: number = currentTime - job.timestamp;
        while(timeElapsed >= this.timeWindow) {
            console.log(`INFO: timeElapsed: ${timeElapsed} - timeWindow: ${this.timeWindow}`);
            this.queue.shift();
            if (!this.queue.length) {
                return;
            }

            job = this.queue[0];
            timeElapsed = currentTime - job.timestamp;
        }
        return;
    }
}
