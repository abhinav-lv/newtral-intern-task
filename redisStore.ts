import { config as envConfig } from "dotenv";
import RedisStore from "connect-redis";
import { createClient } from "redis";

envConfig();
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store
export const redisStore = new RedisStore({
    client: redisClient,
    prefix: process.env.SESSION_PREFIX || "sess",
});
