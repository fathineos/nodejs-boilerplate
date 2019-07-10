# TxInsights

TxInsights is a  service to parse application logs into a centralized place.
The logs will enhanced with Transifex Domain information in order to provide
more insights.


## TxInsights Domain

TBD


## TxInsights Architecture

TxInsights is consisted of workers.


### Worker

The workers are responsible to consume metrics sqs messages and populate the
Elasticsearch database.


#### Events Consumption Rate

The messages consumption rate depends the following parameters.
- Number of workers (pods) per priority
- Consumers batch size to process messages in parallel


#### Events lifetime

From the moment a message is registered to SQS it remains in the queue until
deleted by the consumer.
The consumers retrieve messages from the queue with long polling and
In case of failure during the consumption of a sqs message, this will be
retried after the sqs visibility timeout is passed. For more details check
[sqs visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)


## Development workflow

1. Create container global_search:devel
   ```
   make build
   ```
2. Run tests with precommit and coverage
   ```
   make citest
   ```
3. Run the development server
   ```
   make up
   ```
4. Run specific test
   ```
   docker-compose \
     -f docker-compose.ci.yml \
     -f docker-compose.yml \
     run --rm \
     --entrypoint=npm \
     txinsights-worker run test -- --grep=<test_name>
   ```
5. Run tests with debugger
   ```
   docker-compose \
     -f docker-compose.ci.yml \
     -f docker-compose.yml \
     run --rm \
     --entrypoint=npm \
     -p 127.0.0.1:9229:9229 \
     txinsights-worker run test -- --inspect-brk=0.0.0.0:9229
   ```
6. Run tests development server with debugger
   ```
   docker-compose \
     -f docker-compose.dev.yml \
     -f docker-compose.yml \
     run --rm \
     --entrypoint=npm \
     -p 127.0.0.1:9229:9229 \
     -p 127.0.0.1:8009:8009 \
     txinsights-worker run start-worker-dev
   ```
