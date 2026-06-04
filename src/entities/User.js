import { EntitySchema } from "typeorm";

export const User = new EntitySchema ({
    name: "User", 
    tableName: "users",
    columns: {
        id : {
            type: "uuid",
            primary: true, 
            generated: "uuid"
        },

        name: {
            type: "varchar",
            length: 100,
        },
        email: {
            type: "varchar", 
            length: 150, 
            unique: true
        },
        password : {
            type: "varchar"
        },
        createdAt: {
            name: "created_at",
            type: "timestamp",
            createDate:true
         },
         updatedAt: {
            name: "updated_at",
            type: "timestamp",
            updateDate: true,
         },
        
    },

    relations: {
        memberships: {
            type: "one-to-many",
            target: "TeamMember",
            inverseSide: "user", 
        },
            createdProjects: {
      type: "one-to-many",
      target: "Project",
      inverseSide: "createdBy",
    },

    createdTasks: {
      type: "one-to-many",
      target: "Task",
      inverseSide: "createdBy",
    },

    assignedTasks: {
      type: "one-to-many",
      target: "Task",
      inverseSide: "assignedTo",
    },
  
    }
});
