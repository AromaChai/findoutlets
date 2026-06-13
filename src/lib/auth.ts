import "server-only";
import { createHmac } from "crypto";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "aroma_admin";

// Mark the cookie "secure" only on real HTTPS requests. Vercel sits behind
// HTTPS (x-forwarded-proto: https) so production stays secure, while local
// http://localhost testing still works.
async function isHttps(): Promise<boolean> {
  const h = await headers();
  return h.get("x-forwarded-proto") === "https";
}

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password)
    .update("aromachai-admin-session-v1")
    .digest("hex");
}

export async function isLoggedIn(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === expected;
}

export async function login(password: string): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  if (password !== process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, expectedToken()!, {
    httpOnly: true,
    secure: await isHttps(),
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
