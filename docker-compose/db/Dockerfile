FROM postgres:14
WORKDIR /app
COPY ./scripts/dump.sql ./scripts/motorway-test-backend/dump.sql
COPY ./scripts/init.sh /docker-entrypoint-initdb.d
