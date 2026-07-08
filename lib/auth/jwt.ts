import "server-only";

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "cynthia_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type SessionPayload = {
  userId: string;
  role: string;
  email: string;
};

function getKey() {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "NEXTAUTH_SECRET precisa estar definido com pelo menos 32 caracteres.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function encryptSession(
  payload: SessionPayload,
  expiresAt: Date,
): Promise<string> {
  return new SignJWT({ ...payload } as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getKey());
}

export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.userId === "string" && typeof payload.role === "string") {
      return {
        userId: payload.userId,
        role: payload.role,
        email: typeof payload.email === "string" ? payload.email : "",
      };
    }

    return null;
  } catch {
    return null;
  }
}
