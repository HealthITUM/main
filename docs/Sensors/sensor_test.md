# Sensor test script.

## Connecting the sensors and the ESP 32 S3

First we connect the ground and 3.3V lines to the sensors at VCC and GND. The data line for the soil moisture sensor should be connected to GPIO pin 6. Then we connect SCL and SDA lines together and connect them to the ESP - SCL to pin 5 and SDA to pin 4.

## Running the script

When the script runs you should turn on serial monitor and seit it to 115200 baud. After that send character 's' to start receiving the sensor readings and x to stop.

## Returned values

The returned values are going to be: T for air temperature, (°C), L for light level, (lumens), P for air pressure (bars), H for air humidity (%) and S for soil moisture (%).