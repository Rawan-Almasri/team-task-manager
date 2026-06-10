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


//search and filter tasks validation schema
//sort task schema

export const getProjectTasksSchema = z.object({
  query: z.object({
    status: z
      .enum(["todo", "in_progress", "done", "cancelled"])
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional(),

    search: z.string().optional(),

    sortBy: z
      .enum(["createdAt", "updatedAt", "title", "priority"])
      .optional(),

    order: z
      .enum(["asc", "desc"])
      .optional(),


      //Pagination variables check
     page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),

  }),
})