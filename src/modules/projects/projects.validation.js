import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .refine((value) => value.length > 0, "Project name is required")
        .refine(
          (value) => value.length >= 2,
          "Project name must be at least 2 characters"
        )
    ),

    description: z.string().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z
      .preprocess(
        (value) => value ?? "",
        z
          .string()
          .trim()
          .refine(
            (value) => value.length >= 2,
            "Project name must be at least 2 characters"
          )
      )
      .optional(),

    description: z.string().optional(),
  }),
});