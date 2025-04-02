#!/bin/bash

# Start MongoDB instances
mongod --replSet myReplSet --port 27017 --dbpath ~/rs1/data --bind_ip localhost &
mongod --replSet myReplSet --port 27018 --dbpath ~/rs2/data --bind_ip localhost &
mongod --replSet myReplSet --port 27019 --dbpath ~/rs3/data --bind_ip localhost &

# Wait for MongoDB to be ready (more robust check)
until mongo --port 27017 --eval "db.adminCommand('ping').ok" --quiet > /dev/null 2>&1; do
  echo "Waiting for MongoDB to be ready..."
  sleep 1
done

# Initiate replica set
if mongo --port 27017 --eval "rs.initiate({ _id: 'myReplSet', members: [{ _id: 0, host: 'localhost:27017' }, { _id: 1, host: 'localhost:27018' }, { _id: 2, host: 'localhost:27019' }] })" --quiet; then
    echo "Replica set initiated successfully."
    sleep 5 # Add a delay for stabilization
else
    echo "Failed to initiate replica set."
    exit 1
fi

# Check replica set status
until mongo --port 27017 --eval "rs.status().ok" --quiet > /dev/null 2>&1; do
    echo "Waiting for replica set to be ready..."
    sleep 1
done

# Start Node.js server
npm run dev # or yarn dev, or node your_server.js