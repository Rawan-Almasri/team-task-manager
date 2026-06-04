import { EntitySchema } from "typeorm";

export const Project = new EntitySchema({
  name: "Project",
  tableName: "projects",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    name: {
      type: "varchar",
      length: 120,
    },

    description: {
      type: "text",
      nullable: true,
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
    team: {
      type: "many-to-one",
      target: "Team",
      inverseSide: "projects",
      joinColumn: {
        name: "team_id",
      },
      onDelete: "CASCADE",
    },

    createdBy: {
      type: "many-to-one",
      target: "User",
      inverseSide: "createdProjects",
      joinColumn: {
        name: "created_by_id",
      },
      onDelete: "RESTRICT",
    },

    tasks: {
      type: "one-to-many",
      target: "Task",
      inverseSide: "project",
    },
  },
});