#!/bin/bash
echo "purging database..."
env-cmd cross-var docker exec -it %DOCKER_DB_NAME% psql -U %PGUSER% -d %PGDATABASE% -a -f app/dev/db/sql/dropTables.sql

echo "generating new data..."
node src/db/dev/seeder;

echo "copying necessary files..."
env-cmd cross-var docker cp src/db/dev/data/. %DOCKER_DB_NAME%:/app/dev/db/data/
env-cmd cross-var docker cp src/db/dev/sql/. %DOCKER_DB_NAME%:/app/dev/db/sql/

echo "creating tables and populating seed data..."
env-cmd cross-var docker exec -it %DOCKER_DB_NAME% psql -U %PGUSER% -d %PGDATABASE% -a -f app/dev/db/sql/createTables.sql
env-cmd cross-var docker exec -it %DOCKER_DB_NAME% psql -U %PGUSER% -d %PGDATABASE% -a -f app/dev/db/sql/seed.sql