const { createClient } = require('redis');
require('dotenv').config(); 

// Create a Redis client
const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

// Handle Redis connection errors
client.on('error', (err) => console.error('Redis Client Error', err));

// Function to initialize the Redis connection
const ConnectRedis = async () => {
    try {
        await client.connect();
        console.log('Connected to Redis Cloud');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

// Export the client and ConnectRedis function
module.exports = {
    ConnectRedis,
    client,
};
