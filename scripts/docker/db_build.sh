#!/bin/bash
psql -U postgres -c 'create database budgetapp'
psql -U postgres -d budgetapp -a -f /docker-entrypoint-initdb.d/sql/1-init.sql
psql -U postgres -d budgetapp -a -f /docker-entrypoint-initdb.d/sql/2-seed.sql