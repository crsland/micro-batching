import { BatchStrategyFactory } from '../lib/batch-strategy-factory';
import { SlidingWindow } from '../lib/strategy/sliding-window';
import { CapacityWindow } from '../lib/strategy/capacity-window';
import { config } from '../config';

describe('Capacity Window Strategy', () => {
  
    it('Should return an instance of a registered strategy', async () => {
        config.strategy = 'sliding-window';        
        const instance = BatchStrategyFactory.getBatchingStrategy();
        expect(instance).toBeInstanceOf(SlidingWindow);
    });

    it('Should use the default strategy when an unregistered one is passed', async () => {
        config.strategy = 'non-existing-strategy';
        const instance = BatchStrategyFactory.getBatchingStrategy();
        expect(instance).toBeInstanceOf(CapacityWindow);
    });
  });
  