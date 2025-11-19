// src/app/login/state.ts

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialAuthState: AuthActionState = { status: "idle" };
