import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .refine((value) => value.length > 0, "Task title is required")
        .refine(
          (value) => value.length >= 2,
          "Task title must be at least 2 characters"
        )
    ),

    description: z.string().optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional()
      .default("medium"),

    assignedToId: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({

  body: z.object({
    title: z
      .preprocess(
        (value) => value ?? "",
        z
          .string()
          .trim()
          .refine(
            (value) => value.length >= 2,
            "Task title must be at least 2 characters"
          )
      )
      .optional(),

    description: z.string().optional(),

    status: z.enum(["todo", "in_progress", "done", "cancelled"]).optional(),

    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

    assignedToId: z.string().optional(),
  }),
});


export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.preprocess(
      (value) => value ?? "",
      z.enum(["todo", "in_progress", "done", "cancelled"], {
        error: "Status must be one of: todo, in_progress, done, cancelled",
      })
    ),
  }),
});