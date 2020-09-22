#!/bin/bash
echo "init running in '${POSTGRES_ENV}'"

psql -U postgres -c 'create database budgetapp'
psql -U postgres -d budgetapp -a -f /docker-entrypoint-initdb.d/sql/1-init.sql
if [ "${POSTGRES_ENV}" = "development" ]; then 
    psql -U postgres -d budgetapp -a -f /docker-entrypoint-initdb.d/sql/2-seed.sql
fi