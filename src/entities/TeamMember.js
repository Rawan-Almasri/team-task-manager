import { EntitySchema } from "typeorm";

export const TeamMember = new EntitySchema({
  name: "TeamMember",
  tableName: "team_members",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    role: {
      type: "enum",
      enum: ["admin", "manager", "member"],
      default: "member",
    },

    isOwner: {
      name: "is_owner",
      type: "boolean",
      default: false,
    },

    joinedAt: {
      name: "joined_at",
      type: "timestamp",
      createDate: true,
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

  uniques: [
    {
      name: "UQ_team_member_user_team",
      columns: ["user", "team"],
    },
  ],

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "memberships",
      joinColumn: {
        name: "user_id",
      },
      onDelete: "CASCADE",
    },

    team: {
      type: "many-to-one",
      target: "Team",
      inverseSide: "members",
      joinColumn: {
        name: "team_id",
      },
      onDelete: "CASCADE",
    },
  },
});