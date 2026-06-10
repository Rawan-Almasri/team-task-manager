import {AppDataSource} from "../../config/data-source.js";
import {TeamMember} from "../../entities/TeamMember.js";
import {Project} from "../../entities/Project.js";
import {Task} from "../../entities/Task.js";

import { ILike } from "typeorm";
import { userResponseDto } from "../../dtos/user.dto.js";
import { buildSorting } from "../../utils/buildSorting.js";

const TeamMemberRepository = AppDataSource.getRepository(TeamMember);
const ProjectRepository = AppDataSource.getRepository(Project);    
const TaskRepository = AppDataSource.getRepository(Task);

export const getDashboardStatsService  = async (userID) => {
    const teamsCount = await TeamMemberRepository.count({
         where: { user: { id: userID } 
        } });    

        const projectsCount = await ProjectRepository.createQueryBuilder("project")
        .innerJoin("project.team", "team")
        .innerJoin("team.members", "member")
        .where("member.user_id = :userID", { userID }) /*You can write this because team member has joinColumn named user_id */
        .getCount();

        const tasksCount = await TaskRepository.createQueryBuilder("task")
        .innerJoin("task.project", "project")
        .innerJoin("project.team", "team")
        .innerJoin("team.members", "member")
        .where("member.user_id = :userID", { userID })
        .getCount();

        const todoTasksCount = await TaskRepository
        .createQueryBuilder("task")
        .innerJoin("task.project", "project")
        .innerJoin("project.team", "team")
        .innerJoin("team.members", "member")
        .where("member.user_id = :userID", { userID })
        .andWhere("task.status = :status", { status: "todo" })
        .getCount();

        const inProgressTasksCount = await TaskRepository
        .createQueryBuilder("task")
        .innerJoin("task.project", "project")
        .innerJoin("project.team", "team")
        .innerJoin("team.members", "member")
        .where("member.user_id = :userID", { userID })
        .andWhere("task.status = :status", { status: "in_progress" })
        .getCount();

        const completedTasksCount = await TaskRepository
        .createQueryBuilder("task")
        .innerJoin("task.project", "project")
        .innerJoin("project.team", "team")
        .innerJoin("team.members", "member")
        .where("member.user_id = :userID", { userID })
        .andWhere("task.status = :status", { status: "done" })
        .getCount();

          const cancelledTasksCount = await TaskRepository
        .createQueryBuilder("task")
        .innerJoin("task.project", "project")
        .innerJoin("project.team", "team")
        .innerJoin("team.members", "member")
        .where("member.user_id = :userID", { userID })
        .andWhere("task.status = :status", { status: "cancelled" })
        .getCount();


  return {
    teamsCount,
    projectsCount,
    tasksCount,
    tasksByStatus: {
      todo: todoTasksCount,
      inProgress: inProgressTasksCount,
      completed: completedTasksCount,
      cancelled: cancelledTasksCount,
    },
  };
};

export const getMyAssignedTasksService = async ({userID, filters, sorting}) => {
    const tasks = await TaskRepository.find ({
        where: {
            assignedTo: { id: userID },

    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
    ...(filters.search && { title: ILike(`%${filters.search}%`) }),
        }, 
        relations: {
            project: {team : true},
            createdBy: true,
            assignedTo: true,
        },
        order: buildSorting(sorting.sortBy, sorting.order),
    });

    return tasks.map(task => ({
        ...task,
        createdBy: userResponseDto(task.createdBy),
        assignedTo: userResponseDto(task.assignedTo),   
    }));
};