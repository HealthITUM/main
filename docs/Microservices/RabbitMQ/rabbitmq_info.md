# RabbitMQ
## 1. Basic
RabbitMQ is a AMQP broker, that allows us to create queue's of messages. In this project, we use RabbitMQ as transportation layer between **monolith** and **microservices**.
## 2. How does it work?
### 2.1 Queue
Queue - channel of communication between publisher and subscriber. On one way data flows into the queue, from another subscriber can get it easily. One of the advantages of RabbitMQ is a durability-parameter, which allows us to save the file on the disk and store it until data will be taken from the queue by subscriber. With the help of that, we can publish data into the queue, forget about it and start doing another stuff. Subscriber can take the data from the queue whenever he wants, because data from queue will not disappear until it is used. 
### 2.2 Exchanger.
Exchanger is used for routing messages, which allows us to make limitless number of queues and correctly route messages into specific queues. In our project, we use **TOPIC** way of routing in order to make routing easiest. According to this scheme:

# 

![Architecture](./RabbitMQ_Diagram/RabbitMQ_Diagram.drawio.svg)

For each key, we have its own queue. That way, task with route key ```scrapper.task.#``` will go straight to queue, that has its route key. There are 6 route keys:
* **Scrapper service**
    * ```scrapper.task.#``` - queue for tasks. Monolith -> Scrapper
    * ```scrapper.result.#``` - queue for results. Scrapper -> Monolith
* **Plant Detection service**
    * ```pdet.task.#``` - queue for tasks. Monolith -> Plant Detection
    * ```pdet.result.#``` - queue for results. Plant Detection -> Monolith
* **Sensor service**
    * ```sensor.data.#``` - queue for data, that we get from sensors. Sensor -> Monolith
* **Notification service**
    * ```notif.data.#``` - queue for data, that is used for notification system. Monolith -> Notification service

#

We use ```#``` in order to get everything, that will be after dot. If we want specify it to one single word, we can use ```*```.
**EXAMPLE:**
* ```scrapper.task.#```:
    * ```scrapper.task.test``` - works.
    * ```scrapper.task.test.1``` - works.
* ```scrapper.task.*```:
    * ```scrapper.task.test``` - works.
    * ```scrapper.task.test.1``` - DOES NOT works.

### 2.3 Error Handling.
#### 2.3.1 Retry Policy
Retry policy is a rule on how many times service should try to connect to RabbitMQ before ending. **TBC**
## 3. ENV and Deployment.
We should add ```RABBITMQ_URL``` in our .env file.