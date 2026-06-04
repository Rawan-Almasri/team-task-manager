import { z } from "zod";


export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Team name must be at least 2 characters"),

    description: z.string().optional(),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Team name must be at least 2 characters").optional(),

    description: z.string().optional(),
  }),
});