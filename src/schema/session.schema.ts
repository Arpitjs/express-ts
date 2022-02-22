import { object, string } from "zod";

export const createSessionSchema = object({
  body: object({
 
    password: string({
      required_error: "password is required",
    }).min(6, "password too short"),

    email: string({ required_error: "email is required." }).email(
      "invalid email."
    ),
  })
});

