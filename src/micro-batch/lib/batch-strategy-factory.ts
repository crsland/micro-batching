import { config } from "../config";
import { BatchStrategyInterface } from "./strategy/batch-strategy.interface";
import { SlidingWindow } from "./strategy/sliding-window";
import { FixedWindow } from "./strategy/fixed-window";
import { CapacityWindow } from "./strategy/capacity-window";
import { StrategyType } from "./strategy/strategy-enum";


const batchingStrategiesRegister: Map<StrategyType, any> = new Map();
batchingStrategiesRegister.set(StrategyType.SLIDING_WINDOW, SlidingWindow);
batchingStrategiesRegister.set(StrategyType.FIXED_WINDOW, FixedWindow);
batchingStrategiesRegister.set(StrategyType.CAPACITY_WINDOW, CapacityWindow);

console.log(`config.capacity: ${config.capacity}`);
console.log(`config.timeWindow: ${config.timeWindow}`);

export class BatchStrategyFactory {

    public static getBatchingStrategy(): BatchStrategyInterface {
        let strategy = config.strategy as StrategyType;
        if (!batchingStrategiesRegister.has(strategy)) {
            // Provides resilience to the system. Even if the stratehy is misconfigured
            // the system continue to function
            console.log(`MicroBatching strategy: ${strategy} is not registered. Using default`);
            strategy = StrategyType.CAPACITY_WINDOW;
        }

        const instance: BatchStrategyInterface = new (batchingStrategiesRegister.get(strategy))();
        // This could be replaced by a Configuration Options object that is passed to the constructur
        // of the strategies. That way it can be more extensible. Out Of Scope for now.
        instance.capacity = config.capacity;
        instance.timeWindow = config.timeWindow;
        return instance;
    }
}
