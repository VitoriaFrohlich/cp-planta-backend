#!/bin/bash

# Aguardar o PgAdmin iniciar completamente
until curl -s http://localhost:80/api/v1/servers; do
  echo "Aguardando PgAdmin inicializar..."
  sleep 5
done

# Define a configuração do servidor
SERVER_CONFIG='{
  "name": "cpplanta-db",
  "group": 1,
  "host": "pgbouncer",
  "port": 6432,
  "username": "postgres",
  "password": "postgres",
  "maintenance_db": "postgres"
}'

# Enviar a configuração para a API do PgAdmin
curl -X POST \
  -H "Content-Type: application/json" \
  -d "$SERVER_CONFIG" \
  http://localhost:80/api/v1/servers
