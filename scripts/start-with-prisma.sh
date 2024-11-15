#!/bin/bash

LOG_FILE="/app/scripts/start-with-prisma.log"
PRISMA_CMD="npx prisma generate"
RETRY_INTERVAL=20 # seconds
MAX_RETRIES=2

log() {
    echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" >> $LOG_FILE
}

# Limpa o arquivo de log
: > $LOG_FILE

log "Starting configuration script."

attempt=1

while [ $attempt -le $MAX_RETRIES ]; do
    log "Trying to run: $PRISMA_CMD (attempt $attempt of $MAX_RETRIES)"
    
    if $PRISMA_CMD; then
        log "Command '$PRISMA_CMD' executed successfully!"
        break
    else
        log "Failed to execute '$PRISMA_CMD'. Trying again in $RETRY_INTERVAL seconds..."
        attempt=$((attempt + 1))
        sleep $RETRY_INTERVAL
    fi
done

if [ $attempt -gt $MAX_RETRIES ]; then
    log "Maximum number of attempts reached. Command '$PRISMA_CMD' was not executed successfully."
    exit 1
fi

log "Starting server with npm run start:${NODE_ENV:-dev}"
npm run start:${NODE_ENV:-dev}

if [ $? -eq 0 ]; then
    log "Server started successfully."
else
    log "Failed to start server."
    exit 1
fi
