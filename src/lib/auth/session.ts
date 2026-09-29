import { cookies } from "next/headers";
import { AuthUser, LoginResult } from "@/types/auth";

const SESSION_COOKIE_NAME = "movi_owner_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// Default owner credentials (can be overridden via environment variables)
const DEFAULT_OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@movicoffee.lk";
const DEFAULT_OWNER_PASSWORD = process.env.OWNER_PASSWORD || "movi2026";

const OWNER_USER: AuthUser = {
  id: "user-owner-001",
  email: DEFAULT_OWNER_EMAIL,
  name: "Movi Coffee Management",
  role: "owner",
};

export async function loginOwner(password: string, email?: string): Promise<LoginResult> {
  const enteredEmail = email?.trim().toLowerCase() || DEFAULT_OWNER_EMAIL;
  
  if (password === DEFAULT_OWNER_PASSWORD && (enteredEmail === DEFAULT_OWNER_EMAIL || !email)) {
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: OWNER_USER.id,
        email: OWNER_USER.email,
        role: OWNER_USER.role,
        createdAt: Date.now(),
      })
    ).toString("base64");

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return {
      success: true,
      user: OWNER_USER,
    };
  }

  return {
    success: false,
    error: "Invalid email or owner passkey.",
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (decoded && decoded.role === "owner") {
      return OWNER_USER;
    }
    return null;
  } catch {
    return null;
  }
}

export async function logoutOwner(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
