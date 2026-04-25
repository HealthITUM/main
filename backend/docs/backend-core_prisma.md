# Prisma
In order to make it as comfortable as possible, we use Prisma to enable ORM (Object Relational Mapper), which allows us to get/post/update/delet info from/to our PostgreSQL database without direct SQL-code, but with TypeScript.

## Configuration ```main/prisma/schema.prisma```
Prisma is entry-point for our PostgreSQL Database, that means, that all tables, fields, entities, relations and exc. should be described and written in schema.prisma file.
### Prisma docs
'Next, choose how you want to set up your database:

CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.'
### .env
Inside of .env file we contain Database_URL.