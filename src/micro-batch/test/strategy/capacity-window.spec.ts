import { CapacityWindow } from '../../lib/strategy/capacity-window';

describe('Capacity Window Strategy', () => {

    beforeEach(async () => {

    });
  
    it('Should have the batch ready when it reaches capacity', async () => {

        const service = new CapacityWindow();
        service.capacity = 10;

        for (let i = 0; i < 5; i++) {
            const jobDataTest = {
                timestamp: Date.now(),
                job: {
                    id: i,
                    execute: () => `job test`,
                }
            };

            service.prepareBatch(jobDataTest);
        }
        expect(service.isBatchReady()).toBe(false);
    });

    it('Should return the batch correctly', async () => {

        const service = new CapacityWindow();
        service.capacity = 5;

        for (let i = 0; i < 5; i++) {
            const jobDataTest = {
                timestamp: Date.now(),
                job: {
                    id: i,
                    execute: () => `job test`,
                }
            };

            service.prepareBatch(jobDataTest);
        }

        const results = service.getMicroBatch();
        expect(results.length).toBe(5);
    });    
  });
  