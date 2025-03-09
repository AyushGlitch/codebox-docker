# CodeBox Setup Guide

This guide provides step-by-step instructions to set up and run CodeBox on your local machine.

## Prerequisites

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [pnpm](https://pnpm.io/installation)

## Setup Instructions

### 1. Start MinIO Container

```sh
cd orchestrator
pnpm run start2
```

### 2. Access MinIO GUI

- Open [http://localhost:9001](http://localhost:9001) in your browser.
- Login using:
  - **Username**: `user`
  - **Password**: `password`

### 3. Configure MinIO

- Create a **bucket** named `code-box`.
- Upload the `store-data` folder to this bucket.
- Create **Access Keys** with the following credentials:
  - **Access Key**: `2KB3SpO8E9vk5bmU9brK`
  - **Secret Key**: `uvbKZoElanKkUxYTuIDs2SJisvbQLgfs5Zej9s2Y`

### 4. Start Services

#### Start Orchestrator
```sh
pnpm run start
```

#### Start Frontend
```sh
cd frontend
pnpm run dev
```

#### Start Express Server
```sh
cd express
pnpm run start
```

### 5. Access Application

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Use the application as needed.

## Notes

- Ensure Docker is running before executing any commands.
- If any service fails to start, check logs and resolve dependency issues.

---

Happy Coding! 🚀

