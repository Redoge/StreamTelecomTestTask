FROM timescale/timescaledb:latest-pg17
EXPOSE 5432
COPY ./init-db/init.sql /docker-entrypoint-initdb.d/
