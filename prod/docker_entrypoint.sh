#!/bin/bash
set -e

# Inject the node ID, node name, and host into repmgr.conf
sed -i "s/node_id=.*/node_id=$NODE_ID/" /etc/repmgr.conf
sed -i "s/node_name=.*/node_name=$NODE_NAME/" /etc/repmgr.conf
sed -i "s/host=.*/host=$NODE_HOST/" /etc/repmgr.conf

if [ "$ROLE" = 'primary' ]; then
    echo "Starting PostgreSQL primary node..."
    if [ ! -s "$PGDATA/PG_VERSION" ]; then
        echo "Initializing database..."
        initdb
        cp /etc/postgresql/postgresql.conf "$PGDATA/"
        cp /etc/postgresql/pg_hba.conf "$PGDATA/"
    fi
    # Register the primary node with repmgr
    repmgr -f /etc/repmgr.conf primary register
elif [ "$ROLE" = 'replica' ]; then
    echo "Starting PostgreSQL replica node..."
    rm -rf "$PGDATA"/*
    until pg_basebackup -h $REPLICATE_FROM -D "$PGDATA" -U $POSTGRES_USER -vP --wal-method=stream; do
        echo "Waiting for primary to be ready..."
        sleep 5
    done
    cat >> "$PGDATA/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$REPLICATE_FROM port=5432 user=$POSTGRES_USER password=$POSTGRES_PASSWORD'
EOF
    touch "$PGDATA/standby.signal"
    # Register the replica node with repmgr
    repmgr -f /etc/repmgr.conf standby register
else
    echo "Error: ROLE environment variable not set to 'primary' or 'replica'."
    exit 1
fi

chown -R postgres:postgres "$PGDATA"

# Start PostgreSQL and pgBouncer
pgbouncer /etc/pgbouncer/pgbouncer.ini
exec postgres &
