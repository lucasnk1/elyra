import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/cache/redis-client";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/elyra_session=([^;]+)/);
    if (!match) return NextResponse.json({ ok: false, user: null });
    const sessionId = match[1];
    const redis = getRedisClient();
    const raw = await redis.get(sessionId);
    if (!raw) return NextResponse.json({ ok: false, user: null });
    const user = JSON.parse(raw);
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, user: null }, { status: 500 });
  }
}
