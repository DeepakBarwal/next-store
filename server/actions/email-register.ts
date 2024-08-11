"use server";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { actionClient } from "@/lib/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import { generateEmailVerificationToken } from "./tokens";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        // await sendVerificationEmail()

        return { success: "Email confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    // when user not registered
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
    const verificationToken = await generateEmailVerificationToken(email);
    // await sendVerificationEmail()

    return { success: "Confirmation email sent" };
  });
