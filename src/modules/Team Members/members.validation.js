import { z } from "zod";

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),

    role: z.enum(["admin", "manager", "member"]).default("member"),
  }),
});


export const changeMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "manager", "member"]),
    memberId: z.preprocess(
      (value) => value ?? "",
      z.string().nonempty("MemberId is required")
    ),
  }),

});




