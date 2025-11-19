// src/app/signup/types.ts
// Types et état initial du formulaire d’inscription

export type SignupActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export const initialSignupState: SignupActionState = { status: "idle" };
