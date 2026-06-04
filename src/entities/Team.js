import { EntitySchema } from "typeorm";

export const Team = new EntitySchema({
  name: "Team",
  tableName: "teams",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    name: {
      type: "varchar",
      length: 100,
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
    members: {
      type: "one-to-many",
      target: "TeamMember",
      inverseSide: "team",
    },

    projects: {
      type: "one-to-many",
      target: "Project",
      inverseSide: "team",
    },
  },
});