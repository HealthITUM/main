## Monolith Backend Node.js + Express.js
Monolith backend on Node.js + Express.js.

## Docker compose
To start the backend you need to have docker installed (documentation available at https://docs.docker.com/) and run 
`docker compose up`. 
Wait for the containers to start. To see if your backend works correctly you should go to:
`http://localhost:3001/test-db`
and if everyting is working as it should you should get this json:
```json
{"status":"Success","message":"Connected to PostgreSQL!"}
``` 

### What it does
Docker compose is going to start two containers:

  - backend that runs nodemon the dev script on port 3001
  - postgres that starts the PosgtreSQL database on port 5432 and also runs a health check every 5 seconds

user, password and database should be in the .env file (example in .env.example).

## Package.json
### Core Infrastructure & Runtime

These packages form the foundational runtime environment, language support, and development tooling.

*   **typescript (`^6.0.3`)**  
    The primary programming language, adding static typing to JavaScript for better maintainability and error catching.
*   **@types/node (`^25.7.0`)**  
    Provides TypeScript type definitions for core Node.js features (like file system access and process management).
*   **tsx (`^4.22.0`)**  
    A fast TypeScript execute file watcher. It allows running TypeScript files directly without manually compiling them to JavaScript first.
*   **nodemon (`^3.1.14`)**  
    Monitors the project directory for file changes and automatically restarts the Node.js application, optimizing the development workflow.

### Web Framework & Middleware

These dependencies handle incoming HTTP requests, server routing, and standard web traffic utilities.

*   **express (`^5.2.1`)**  
    The core web framework used to build HTTP routes, handle requests, and send responses. This project utilizes the modern v5 release.
*   **cors (`^2.8.6`)**  
    Middleware that enables Cross-Origin Resource Sharing, allowing your API to securely accept requests from frontend applications hosted on different domains.
*   **cookie-parser (`^1.4.7`)**  
    Parses the `Cookie` header from incoming requests and populates `req.cookies`, making it easy to read user sessions or auth tokens.
*   **morgan (`^1.10.1`)**  
    An HTTP request logger middleware that prints details about incoming requests (method, status code, response time) to the console for debugging.

> **TypeScript Note:** The `@types/` prefixed versions of Express, Cors, Cookie-Parser, and Morgan are installed as `devDependencies` to provide autocomplete and type safety for these libraries.

### Database Management (ORM)

The project uses Prisma to manage schema migrations and execute type-safe database queries.

*   **prisma (`7.8.0`)**  
    The Prisma Command Line Interface (CLI). Used in development to run database migrations, view data via Prisma Studio, and generate the client client.
*   **@prisma/client (`^7.8.0`)**  
    The programmatic query builder used inside the application code to read and write data to the database with full TypeScript safety.
*   **@prisma/adapter-pg (`^7.8.0`)**  
    A driver adapter that allows Prisma Client to connect to a PostgreSQL database using specific PG drivers, optimizing connection handling.

### Security & Configuration

*   **bcrypt (`^6.0.0`)**  
    A security library used to securely hash and salt user passwords before storing them in the database, as well as verifying entered passwords during login.
*   **dotenv (`^17.4.2`)**  
    Loads environment variables from a `.env` file into `process.env`. This keeps sensitive data like database credentials and API keys out of the source code.

## Test script

The test script connects to the database and runs a http server on port 3001. The only available route is `/test-db` which returns the status of the database.






