#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "GIT: Pulling latest changes from the main branch..."
# Pull the latest changes from the 'main' branch. If your branch is different (e.g., 'master'), update it here.
git pull origin main

echo "NPM: Installing dependencies..."
npm install

echo "NEXT.JS: Building the project..."
npm run build

echo "PM2: Restarting the application..."
# Restart the existing 'portal-frontend' application in pm2
pm2 restart portal-frontend

echo "Deployment completed successfully!"
