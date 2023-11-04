import { BatchStrategyFactory } from "./batch-strategy-factory";
import { BatchStrategyInterface } from "./strategy/batch-strategy.interface";
import { BatchProcessor } from "./batch-processor";
import { JobData, JobResult } from '../job/job';

/**
 * 
 * @class BatchController
 * 
 * Orchestrates the workflow of the jobs:
 *  - Acceps a job (jobs are sent continously - stream)
 *  - Obtains an instance of a batcher
 *  - Obtains the calculatd batch
 *  - Sends the batch for processing
 *  - Returns the results
 */
export class BatchController {

    private batcher: BatchStrategyInterface
    private batchProcessor: BatchProcessor;

    constructor () {
        this.batcher = BatchStrategyFactory.getBatchingStrategy();
        this.batchProcessor = new BatchProcessor();
    }

    public setBatcher (batcher: BatchStrategyInterface) {
        this.batcher = batcher;
    }

    public setBatchProcessor (batchProcessor: BatchProcessor) {
        this.batchProcessor = batchProcessor;
    }

    /**
     * 
     * @param jobData 
     * @returns Promise<JobResult[]> | null
     */
    public async acceptJob(jobData: JobData): Promise<JobResult[]> {

        this.batcher.prepareBatch(jobData);

        if (this.batcher.isBatchReady()) {
            console.log(`INFO: Micro Batch is ready`);
            const microBatch = this.batcher.getMicroBatch();
            const batchResult = await this.batchProcessor.process(microBatch);
            const results = this.buildResponse(batchResult);
            return results;
        }
        console.log(`INFO: Batching...`);
        return [];
    }

    public flush() {
        return this.buildResponse(
            this.batcher.flush()
        );
    }

    private buildResponse (results): JobResult[] {
        const responses: JobResult[] = [];
        for (const i in results) {
            responses.push(new JobResult(results[i]))
        }
        return responses;
    }
}
