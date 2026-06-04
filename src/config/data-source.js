import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from "./env.js"

import { User } from "../entities/User.js"
import { Team } from "../entities/Team.js"
import { TeamMember } from "../entities/TeamMember.js"
import { Project } from "../entities/Project.js"
import { Task } from "../entities/Task.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.db.host, 
    port : env.db.port,
    username : env.db.username,
    password : env.db.password,
    database : env.db.name,

    synchronize: false, 
    logging: false, 

    entities: [User, Team, TeamMember, Project, Task],

  //entities: ["src/entities/*.js"],
});