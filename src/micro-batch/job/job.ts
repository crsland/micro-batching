export type JobData = {
    job: JobInterface;
    timestamp: number;
}

export class JobResult {
    response: any;
    constructor(result: any) {
        this.response = result;
    }
}

export interface JobInterface {
    id: number;
    execute(): string;
}
