import { JobData } from '../job/job';

/**
 * BatchProcessor
 * 
 * Dummy implementation. As per requirement, this implemenation is more of a placeholder
 */
export class BatchProcessor {

    public process(batch: JobData[]): Promise<any[]> {
        let result = [];
        for (const job of batch) {
            result = [...result, job.job.execute()]
        }

        return Promise.all(result);
    }
}
