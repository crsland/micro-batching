import { MicroBatchClient } from '../client';
import { JobData, JobInterface, JobResult } from '../job/job';
import { BatchController } from '../lib/batch-controller';
// import { BatchProcessor } from '../lib/batch-processor';


// const batchProcessorMock: BatchProcessor = {
//     process: (): Promise<any> => Promise.resolve(),
// };


// const batchControllerMock: BatchController = {
//     batcher: undefined,
//     batchProcessor: batchProcessorMock,
//     acceptJob: jest.fn(),
//     flush: jest.fn(),
//     buildResponse: jest.fn()
// };

class BatchControllerMock extends BatchController {
    public acceptJob(jobData: JobData): Promise<JobResult[]> {
        return super.acceptJob(jobData);
    }
}

jest.mock('../lib/batch-controller');

describe('MicroBatching Client', () => {

    beforeEach(async () => {
        // @ts-ignore
        BatchController.mockClear();
    });
  
    it('Should submit jobs', async () => {
        const sut = new MicroBatchClient({jobs: 10});
        const batchControllerMock = new BatchControllerMock();
        sut.setBatchController(batchControllerMock);
        
        const batchControllerAcceptSpy = jest.spyOn(batchControllerMock, 'acceptJob').mockImplementation();

        let jobMock: JobInterface;
        let results;
        for (let i = 0; i < 10; i++) {
            jobMock = {
                id: i,
                execute: () => `${i}`,
            };
            results = await sut.submitJob(jobMock);
        }
        expect(batchControllerAcceptSpy).toBeCalledTimes(10);
      });
  });
  