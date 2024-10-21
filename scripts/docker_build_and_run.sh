#!/bin/bash

# grant permission on terminal to execute the script with 'chmod +x docker_build_and_run.sh'
# the following commands will download this images, create containers and execute compose

# request user confirmation before proceeding
echo -e "This script will stip and create all docker containers, images, volumes and networks needed by the project.\n Are you sure you want to continue? (yes/no): "
read confirmation

# check if the confirmation is "yes" to continue
if [ "$confirmation" != "yes" ]; then
  echo "Process aborted. No installations were carried out."
  exit 0
fi

# Stop and remove existing containers
docker stop cpplanta_db back || true
docker rm cpplanta_db back || true

# build image from PostgreSQL
docker build -t postgres-db-cpplanta -f dockerfile.postgres .

# build image from backend Node.js
docker build -t backend-cpplanta -f dockerfile.node .

## Modificação: não é mais necessário criar os containers manualmente
## por causa do docker-compose.yml (execução redundante)

# Execute container PostgreSQL
# docker run -d --name cpplanta_db postgres-db-cpplanta

# # Execute container backend Node.js
# docker run -d --name back backend-cpplanta

# clean the terminal
## legal mas perde os logs de execução
#clear

# up the containers Docker with Compose
docker compose up -d

# Check logs for any issues (for specific containers lookup)
docker logs cpplanta_db
docker logs back

# Check logs for any issues
docker compose logs
