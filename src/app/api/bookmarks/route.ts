import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/cache/redis-client";

async function getSessionUser(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/elyra_session=([^;]+)/);
  if (!match) return null;
  const sessionId = match[1];
  const redis = getRedisClient();
  const raw = await redis.get(sessionId);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ ok: false, bookmarks: [] }, { status: 401 });
  const redis = getRedisClient();
  const key = `elyra:bookmarks:${user.id}`;
  const data = (await redis.get(key)) || "[]";
  return NextResponse.json({ ok: true, bookmarks: JSON.parse(data) });
}

export async function POST(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const payload = await request.json();
  const redis = getRedisClient();
  const key = `elyra:bookmarks:${user.id}`;
  const raw = (await redis.get(key)) || "[]";
  const arr = JSON.parse(raw);
  arr.unshift(payload);
  await redis.set(key, JSON.stringify(arr), "EX", 60 * 60 * 24 * 30);
  return NextResponse.json({ ok: true });
}
