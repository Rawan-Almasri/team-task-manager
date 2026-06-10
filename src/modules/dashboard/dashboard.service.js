import {AppDataSource} from "../../config/data-source.js";
import {TeamMember} from "../../entities/TeamMember.js";
import {Project} from "../../entities/Project.js";
import {Task} from "../../entities/Task.js";

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