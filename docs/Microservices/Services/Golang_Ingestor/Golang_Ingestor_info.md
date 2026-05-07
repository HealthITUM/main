# 1. Basic.
## 1.1 Purpose.
In our situation with Monolith backend, it is necessary to use microservice, that will work by **VTC** system:
* Validation
* Transformation
* Confirmation

#

![Scheme](./Golang_Ingestor_Diagram/Golang_Ingestor_Diagram.drawio.svg)
## 1.2 Validation.
Validation is used in order to get the data from **MQTT** and validate the request. Here we check if JSON-scheme is right.
## 1.3 Transformation.
Transformation is used to transform primitive JSON form **MQTT** into JSON that will be send in RabbitMQ. Steps:
* Get **{CHIP_ID}** from **MQTT** and put it inside of JSON.
* Make a timestamp on the time this package was recieved.

**ALERT TBD**: If sensors will send data often, we can just use timestamp, but if sensors will send it not rarely, we need EPS32-C6 to make timestamp when sensors captured and here when they were recieved.
### 1.3.1 Data model.
```
{
    "chip_id": "{CHIP_ID}",
    "timestamp" : "{DATETIME}",
    "data": {
        "moisture" : "{VALUE}",
        "temperature" : "{VALUE}",
        "light" : "{VALUE}"
    }
}
```
## 1.4 Confirmation
This step is all about sending our data to **RabbitMQ**. Most important part of this - making sure, that **RabbitMQ** is able to get the data from microservice and if not follow the **Retry Policy**.
### 1.4.1 RabbitMQ route.
We use ```sensor.data.{CHIP_ID}``` template to send data into the **RabbitMQ** queue. We do it in order to make it possible for us to specify packages from exact plate. 