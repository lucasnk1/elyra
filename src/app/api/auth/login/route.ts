import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/cache/redis-client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    const redis = getRedisClient();
    const sessionId = `sess:${uuidv4()}`;
    const user = { id: `user:${Buffer.from(email).toString("base64")}`, email };
    await redis.set(sessionId, JSON.stringify(user), "EX", 60 * 60 * 24 * 7);

    const res = NextResponse.json({ ok: true, sessionId });
    res.cookies.set("elyra_session", sessionId, { httpOnly: true, path: "/" });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
