# 🌿 HealthIT — PlantIT

> A smart IoT platform for monitoring and caring for your plants in real time.

---

## Overview

**PlantIT** is a full-stack IoT platform for smart plant monitoring and care.  
Users can register their plants, attach physical **ESP32 sensors**, and track real-time data:

| Metric         | Description         |
| -------------- | ------------------- |
| 💧 Moisture    | Soil moisture level |
| 🌡️ Temperature | Ambient temperature |
| ☀️ Light       | Light intensity     |

---

## 🏗️ Architecture

### Sensor Pipeline

Sensor data is transmitted via **MQTT** protocol to a **Go-based Ingestor** service,
which validates and forwards it through **RabbitMQ** message broker to the main backend.

### Backend

Built with **Node.js**, **Express** and **TypeScript**, following a clean:
with **Prisma ORM** and **PostgreSQL** database.

### AI Plant Detection

Users can automatically identify plant species using an AI-powered detection service:

- Built with **TensorFlow** and **MobileNetV2**
- Classifies images into supported plant categories

### Notifications

Push notifications via **Firebase Cloud Messaging** to alert users about abnormal sensor readings.

### Storage

Media files (plant images, recipes) stored in **MinIO** — a self-hosted S3-compatible object storage.

---

## Frontends

| Platform  | Technology   |
| --------- | ------------ |
| 🌐 Web    | React        |
| 📱 Mobile | React Native |

Both share common business logic through a **shared package**.

---

## Deployment

All services are containerized with **Docker** and orchestrated via **Docker Compose**
for easy local and cloud deployment on **Hetzner**.

---

## Team

Built by a team of students as a university project.
We wanted to try something beyond a basic CRUD app —
so we added real sensors, a message broker, and a custom ML model.
