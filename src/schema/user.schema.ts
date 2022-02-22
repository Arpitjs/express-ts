import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "name is required.",
    }),

    password: string({
      required_error: "password is required",
    }).min(6, "password too short"),

    passwordConfirm: string({
      required_error: "password confirm is required",
    }),
    email: string({ required_error: "email is required." }).email(
      "invalid email."
    ),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "passwords do not match!",
    path: ["passwordConfirm"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirm"
>;
