import { BatchController } from '../lib/batch-controller';
import { CapacityWindow } from '../lib/strategy/capacity-window';
import { JobData, JobInterface, JobResult } from '../job/job';
import { BatchProcessor } from '../lib/batch-processor';


// const batchProcessorMock: BatchProcessor = {
//     process: (): Promise<any> => Promise.resolve(),
// };

// jest.mock('../lib/strategy/capacity-window');
// jest.mock('../lib/batch-processor');

describe('Batch Controller', () => {

    beforeEach(async () => {
        // // @ts-ignore
        // BatchController.mockClear();
        // // @ts-ignore
        // BatchProcessor.mockClear();
    });
  
    it('Should accept jobs', async () => {
        const service = new BatchController();
        const batcherMock = new CapacityWindow();
        service.setBatcher(batcherMock);

        const batcherSpy = jest.spyOn(batcherMock, 'prepareBatch').mockImplementation();
        const jobDataTest = {
            timestamp: Date.now(),
            job: {
                id: 1,
                execute: () => `job test`,
            }
        };

       await service.acceptJob(jobDataTest);

        expect(batcherSpy).toBeCalled();        
      });

      it('Should process jobs when the batch is ready', async () => {
        const service = new BatchController();
        const batcherMock = new CapacityWindow();
        const batchProcessorMock = new BatchProcessor();

        service.setBatcher(batcherMock);
        service.setBatchProcessor(batchProcessorMock);

        const jobDataTest = {
            timestamp: Date.now(),
            job: {
                id: 1,
                execute: () => `job test`,
            }
        };

        const batcherSpy = jest.spyOn(batcherMock, 'prepareBatch').mockImplementation();
        jest.spyOn(batcherMock, 'isBatchReady').mockReturnValue(true);
        const batcherGetbatchSpy = jest.spyOn(batcherMock, 'getMicroBatch').mockReturnValue([]);
        const processorBatchSpy = jest.spyOn(batchProcessorMock, 'process').mockResolvedValue([jobDataTest]);

        const result = await service.acceptJob(jobDataTest);

        expect(batcherSpy).toBeCalled();
        expect(batcherGetbatchSpy).toBeCalled();
        expect(processorBatchSpy).toBeCalled();
        expect(result[0]).toBeInstanceOf(JobResult);
      });
  });
  