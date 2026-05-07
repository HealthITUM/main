# Main
## ORM: prisma. Why?
Check ```prisma.md```.
## TypeScript.
We use TS in order to make strict types of objects in our project. It allows us to get and repair mistakes on compile-stage.
### How TS works in our project?
We have ```/src``` folder, that includes all TS code. 
If it is ```build-version```, its compiled into JS.
If it is ```dev-version```, it runs through ts-node.
## Packages:
Added packages:
```
"dependencies": { -- Main Packages
    "@prisma/client": "^7.8.0", -- Bridge to DB
    "dotenv": "^17.4.2", -- Load data from .env
    "express": "^5.2.1", -- Web-Framework
    "pg": "^8.20.0" -- PostgreSQL module for Node.js
  },
  "devDependencies": { -- Dev packages
    "@types/express": "^5.0.6", -- Dictionary for TS (Express.js)
    "@types/node": "^25.6.0", -- Dictionary for TS (Node.js)
    "nodemon": "^3.1.14", -- Easier maintaining of Web-Server. Reloading project on every change in files.
    "prisma": "^7.8.0", -- Prisma engine
    "ts-node": "^10.9.2", -- Allows us to run TS without compiling it to JS
    "typescript": "^6.0.3" -- TypeScript engine
  }
```
# How to start program?
1. **Install dependencies:** `npm install`
2. **Environment Setup:** Create `.env` file in the root directory (refer to `.env.example`).
3. **Generate Prisma Client:** `npx prisma generate`  
   *(This step is required to enable TS autocompletion for DB models)*.
4. **Run in Development mode:** `npm run dev`
5. **Database UI:** `npx prisma studio` (to view/edit data in browser).