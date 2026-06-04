import { EntitySchema } from "typeorm";

export const Task = new EntitySchema({
  name: "Task",
  tableName: "tasks",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    title: {
      type: "varchar",
      length: 150,
    },

    description: {
      type: "text",
      nullable: true,
    },

    status: {
      type: "enum",
      enum: ["todo", "in_progress", "done", "cancelled"],
      default: "todo",
    },

    priority: {
      type: "enum",
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
    },

    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      updateDate: true,
    },
  },

  relations: {
    project: {
      type: "many-to-one",
      target: "Project",
      inverseSide: "tasks",
      joinColumn: {
        name: "project_id",
      },
      onDelete: "CASCADE",
    },

    createdBy: {
      type: "many-to-one",
      target: "User",
      inverseSide: "createdTasks",
      joinColumn: {
        name: "created_by_id",
      },
      onDelete: "RESTRICT",
    },

    assignedTo: {
      type: "many-to-one",
      target: "User",
      inverseSide: "assignedTasks",
      joinColumn: {
        name: "assigned_to_id",
      },
      nullable: true,
      onDelete: "SET NULL",
    },
  },
});