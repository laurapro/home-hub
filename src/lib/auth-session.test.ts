import { describe, expect, it } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { resolveAuthStatus } from "./auth-session";

const session = { access_token: "token" } as Session;

describe("resolveAuthStatus", () => {
  it("treats a stored session as signed in", () => {
    expect(resolveAuthStatus(session)).toEqual({ status: "signed_in", error: null });
  });

  it("treats a missing session as signed out", () => {
    expect(resolveAuthStatus(null)).toEqual({ status: "signed_out", error: null });
  });

  it("treats an invalid/expired session as signed out and surfaces the error", () => {
    expect(resolveAuthStatus(null, new Error("Invalid Refresh Token"))).toEqual({
      status: "signed_out",
      error: "Invalid Refresh Token",
    });
  });
});
