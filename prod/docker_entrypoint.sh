#!/bin/bash
set -e

if [ "$ROLE" = 'primary' ]; then
    echo "Starting PostgreSQL primary node..."
    # Initialize database if necessary
    if [ ! -s "$PGDATA/PG_VERSION" ]; then
        echo "Initializing database..."
        initdb
        # Copy configuration files
        cp /etc/postgresql/postgresql.conf "$PGDATA/"
        cp /etc/postgresql/pg_hba.conf "$PGDATA/"
    fi
elif [ "$ROLE" = 'replica' ]; then
    echo "Starting PostgreSQL replica node..."
    # Remove any existing data
    rm -rf "$PGDATA"/*
    # Perform base backup from primary
    until pg_basebackup -h $REPLICATE_FROM -D "$PGDATA" -U $POSTGRES_USER -vP --wal-method=stream; do
        echo "Waiting for primary to be ready..."
        sleep 5
    done
    # Configure recovery
    cat >> "$PGDATA/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$REPLICATE_FROM port=5432 user=$POSTGRES_USER password=$POSTGRES_PASSWORD'
EOF
    touch "$PGDATA/standby.signal"
else
    echo "Error: ROLE environment variable not set to 'primary' or 'replica'."
    exit 1
fi

# Ensure permissions are correct
chown -R postgres:postgres "$PGDATA"

exec postgres