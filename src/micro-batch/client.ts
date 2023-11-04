import { BatchController } from './lib/batch-controller';
import { JobData, JobInterface, JobResult } from './job/job';

type CLientOptions = {
    jobs: number;
};

const SHUTDOWN = 'shutdown';

/**
 * MicroBatchClient
 * 
 * Allow users to submit jobs.
 * Jobs are then batched based on the configuration selected in the Library
 * 
 *  - Sends jobs for processing using BatchController
 *  - Provides a way to register triggers to users
 */
export class MicroBatchClient {

    private batchController: BatchController;
    private triggerHooksAfterJobsAmt: number;
    private jobsAccepted: number;
    private triggers: Map<string, CallableFunction>;

    constructor (options: CLientOptions) {
        this.triggerHooksAfterJobsAmt = options.jobs;
        this.jobsAccepted = 0;
        this.triggers = new Map();
    }

    /**
     * @method getBatchController
     * @returns BatchController
     * 
     * Done this way for testability. A better option would be DI
     */
    private getBatchController(): BatchController {
        if (this.batchController === undefined) {
            this.batchController = new BatchController();
        }
        return this.batchController;
    }

    public setBatchController(batchController: BatchController): void {
        this.batchController = batchController;
    }

    /**
     * 
     * @param job 
     * @returns 
     */
    async submitJob(job: JobInterface): Promise<JobResult[]> {
        let results: JobResult[] = [];
        try {
            this.jobsAccepted++;
            results = await this.getBatchController().acceptJob(
                this.hydrateJob(job)
            );
        } catch (e) {
            console.log(`ERROR: Job ${job.id} could not be processed. Reason: ${e.message}`);
        }

        if (this.jobsAccepted === this.triggerHooksAfterJobsAmt) {
            this.triggerHook(SHUTDOWN);
        }

        return results;
    }

    /**
     * @method hydrateJob
     * @param job 
     * @returns JobData
     */
    private hydrateJob(job: JobInterface): JobData {
        return {
            job: job,
            // Adds timestamp to mark the moment the job arrives for processing in milliseconds
            timestamp: Date.now()
        }
    }

    /**
     * @method flush
     * @returns JobResult[]
     * 
     * Allows the user to force the client library to release remaining jobs that could not be
     * batched due to windowing strategies
     */
    public flush(): JobResult[] {
        return this.getBatchController().flush();
    }

    public shutDown(callback: CallableFunction): void {
        this.registerTriggers(SHUTDOWN, callback);
    }

    private registerTriggers(type: string, callback: CallableFunction): void {
        this.triggers.set(type, callback);
    }

    private triggerHook(type: string): any {
        console.log(`INFO: ${type} trigger called:`);
        if (this.triggers.has(type)) {
            return (this.triggers.get(type))();
        }
    }
}
