import IORedis from "ioredis";

let client: IORedis | null = null;

export function getRedisClient() {
  if (client) return client;
  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  client = new IORedis(url);
  client.on("error", (e) => console.error("Redis error", e));
  return client;
}
