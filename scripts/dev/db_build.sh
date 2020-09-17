#!/bin/bash.
node src/db/dev/seeder
env-cmd cross-var docker run \
-d -rm \
-v ./scripts/docker/db_build.sh:/docker-entrypoint-initdb.d/db_build.sh \
-v ./scripts/docker/data:/docker-entrypoint-initdb.d/data/ \
-v ./scripts/docker/sql:/docker-entrypoint-initdb.d/sql/ \
%DOCKER_DB_NAME%

# env-cmd cross-var docker exec -it %DOCKER_DB_NAME% mkdir -p /app/dev/db/sql
# env-cmd cross-var docker cp src/db/dev/data/. %DOCKER_DB_NAME%:/app/dev/db/data/
# env-cmd cross-var docker cp src/db/dev/sql/. %DOCKER_DB_NAME%:/app/dev/db/sql/
# env-cmd cross-var docker exec -it %DOCKER_DB_NAME% psql -U %PGUSER% -c 'create database %PGDATABASE%'
# env-cmd cross-var docker exec -it %DOCKER_DB_NAME% psql -U %PGUSER% -d %PGDATABASE% -a -f app/dev/db/sql/createTables.sql
# env-cmd cross-var docker exec -it %DOCKER_DB_NAME% psql -U %PGUSER% -d %PGDATABASE% -a -f app/dev/db/sql/seed.sql