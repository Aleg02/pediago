// src/app/signup/state.ts

export type SignupActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export const initialSignupState: SignupActionState = { status: "idle" };
