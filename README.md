### Micro Batching

Requirements:
Tech Test
Please complete one task from the 2 options outlined below.
## Option 1: Micro-batching library
Micro-batching is a technique used in processing pipelines where individual tasks are grouped
together into small batches. This can improve throughput by reducing the number of requests made
to a downstream system. Your task is to implement a micro-batching library, with the following
requirements:
* it should allow the caller to submit a single Job, and it should return a JobResult
* it should process accepted Jobs in batches using a BatchProcessor
* Don't implement BatchProcessor. This should be a dependency of your library.
* it should provide a way to configure the batching behaviour i.e. size and frequency
* it should expose a shutdown method which returns after all previously accepted Jobs are
processed   

**We will be looking for:**

* a well designed API
* good documentation/comments
* a well written, maintainable test suite  
The requirements above leave some unanswered questions, so you will need to use your judgement
to design the most useful library. Our language preference is Go, but we want to see your best effort,
so please use whatever language you feel most comfortable with for this task.


## Get Started
1. Prepare env file:
```bash
$ cp .env.dist .env
```

2. install dependencies:
```bash
$ yarn install
```

3. Build the image:
```bash
$ make build
```
4. Start the container:
```bash
$ make start
```

## Running unit tests
```bash
$ make test
```

## Technologies used
Application code: Typescript  
Container Runtime: Docker

## Workflow Description
The application entrypoint is located in `src/app.ts`. Here is where the user initialises the `MicroBatchClient` library.  
It then reads jobs from `src/jobs` directory and submits them one at a time.  

The Library internally will use a strategy to perform the micro batching. It is built with extensibility in mind. That means, developers can easily plug their own custom strategies for batching.  

Once the batch is ready, it is sent to a `BatchProcessor` for processing.

**The library can be configured using the environment variables:** 

``STRATEGY={some-strategy}``  
``BATCH_CAPACITY={integer}``  
``BATCH_TIME_WINDOW={milliseconds | integer}``  

### Diagram of the structure of the application

![Alt](/media/micro-batching-application-diagram.png "Title")


# Usage
```typescript
const client = new MicroBatchClient({
    jobs: [jobs amount] // Number specifying how many jobs will be sent
});
```
When `make start` is executed the application will run the following code simulating the jobs submission to the library in `app.ts`:
```typescript
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
```

# API

The library exposes the following methods:

### submitJob()
Submits a job of type JobInterface
```typescript
MicroBatchClient.submitJob(job: JobInterface);
```
### shutdown()
Gets executed when all the jobs are processed
```typescript
MicroBatchClient.shutdown(callback: CallableFunction);
```

### flush()
Forces to flush and process the remaining jobs. This function is useful to process jobs that could not reach a number high enough to be a bacth ready for processing. Note: in a production ready application, this logic would have been handled at Strategy level, ie: [Variable Size Window Algorithm](https://jamie-berrier.medium.com/move-along-c09d59bea473)
```typescript
MicroBatchClient.flush();
```

# Observations 

It is specified that this is a test with several requirements open for interpretation and relatively time based.   
Here is a list of trade offs and decissions that I made in this implementation:

### Batching strategies
The MicroBatching is done based on a capacity bucket. The bucket accumulates jobs. Once the bucket is full, the jobs in it are sent for processing. There are far more strategies for bacthing. Like Sliding Window, Fixed Window, Sessions, etc that requires more time and careful implementation.   
 
For the sake of simplicity, I decided to use a capacity window. The sliding window implementation that can be found in the code is not fully complete.

### Resiliance
Even though the application is coded carefully so a failure in a component does not bring the app down, it is worth mentioning this is not a Production Ready code. That means, better error handling could be added. For example:   
retries in case of processing failure, circuit breakers, catching errors, etc

Another very important concept not implemented in this test (to stay in line with the requirements) is adding a STATE MACHINE for jobs. That could be a very nice addition to a job processing platform. That way the library knows at which state of the operation is each job at.

### Assumptions
The client works under the assumption that it connects to the batchController throughout the network. In this, case it all lives within the same application.  

The application is not built to be run concurrently. It assumes jobs are added on a serial stream
To support concurrency we'll need a distributed store that can keep track of the buckets in each node.

The requirement of the `shutDown` method is assumed to work as a hook. After the user initiallises the client, he/she have the option to set a hook by calling the `shutdown()` function and it passes a callback. Once all jobs are processed, the Library will execute registered `Hooks/Triggers` and invoke the callbacks specified by the user. The hooks logic is implemented by and `Observer` Pattern.

# Output
For example for a micro batch bucket size of 5 jobs, the ouput looks like:

![Alt](/media/micro-batching-ouput.png "Title")
