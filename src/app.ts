import { MicroBatchClient } from './micro-batch/client';
import * as jobs from './jobs/j1';
import { JobInterface } from './micro-batch/job/job';

console.log('Application Started...');

/**
 * User code.
 * 
 * This application simulates the use of MicroBatchClient Library
 * It internally handles all the jobs processing
 */

// Initiallise client
const client = new MicroBatchClient({jobs: Object.entries(jobs).length});
// Set shutdown trigger
client.shutDown(() => {
    console.log('Finished executing all jobs yeaaayy!!');
});

// Utility function
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

/**
 * Read all jobs. Submit them all one at a time to simulate a stream of jobs
 */
(async () => {
    let job: JobInterface;
    for (const j in jobs) {
        job = new jobs[j];
        console.log(`Submitting job: ${job.id}`);
        const results = await client.submitJob(job);

        if (results.length) {
            console.log('results:');
            console.log(results);
        }
    }
    // Flush the jobs queue, returns the remaining jobs that could not be batched
    console.log(client.flush());
})();
