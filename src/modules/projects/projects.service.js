import { AppDataSource } from "../../config/data-source.js";
import { Project } from "../../entities/Project.js";
import { TeamMember } from "../../entities/TeamMember.js";
import { AppError } from "../../utils/AppError.js";

const projectRepository  = AppDataSource.getRepository (Project);
const teamMemberRepository   = AppDataSource.getRepository (TeamMember);

export const createProjectService = async ({teamId, userId, name, description}) => {
    const membership = await teamMemberRepository.findOne({
        where : {
            team : {id :teamId},
        user : {id : userId},
    },
    relations: {
      team: true,
      user: true,
    },
    });

      if (!membership) {
    throw new AppError("Team not found or you are not a member", 404);
  }

  const isAllowed = membership.role === "admin" ||  membership.role === "manager" ||  membership.isOwner;

  if (!isAllowed) {
    throw new AppError("Only admin or manager can create projects", 403);
  }

  const project = projectRepository.create ({
    name,
    description,
    team: membership.team,
    createdBy: membership.user,
  })
  await projectRepository.save(project);

  return project;

};


export const getTeamProjectsService = async ({ teamId, userId }) => {
  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: teamId },
      user: { id: userId },
    },
  });

  if (!membership) {
    throw new AppError("Team not found or you are not a member", 404);
  }

  const projects = await projectRepository.find({
    where: {
      team: { id: teamId },
    },
    relations: {
      createdBy: true, //////////////////////
    },
    order: {
      createdAt: "DESC",
    },
  });

  return projects.map((project) => {
    if (project.createdBy) {
      delete project.createdBy.password;
    }

    return project;
  });
};

export const getProjectByIdService = async ({ projectId, userId }) => {
  const project = await projectRepository.findOne({
    where: {
      id: projectId,
    },
    relations: {
      team: true,
      createdBy: true,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: project.team.id },
      user: { id: userId },
    },
  });

  if (!membership) {
    throw new AppError("You are not allowed to view this project", 403);
  }

  delete project.createdBy.password;

  return project;
};

export const updateProjectService  = async ({projectId, userId, data}) => {
    const project = await projectRepository.findOne({
        where : {id: projectId},
            relations : {
        team : true
    }
    });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where : {
        user: {id: userId},
        team : {id: project.team.id}
    }
  });
   if (!membership) {
    throw new AppError("You are not allowed to update this project", 403);
  }
  const isAllowed = membership.role === "admin" || membership.role === "manager" || membership.isOwner ;

  if (!isAllowed) {
    throw new AppError("Only admin or manager can update projects", 403);
  }

  if (data.name !== undefined) {
    project.name = data.name;
  }

  if (data.description !== undefined) {
    project.description = data.description;
  }

  await projectRepository.save(project);
  return project;
};


export const deleteProjectService   = async ({projectId, userId}) => {
    const project = await projectRepository.findOne({
        where : {id: projectId},
        relations : { team : true }
    });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where : {
        user: {id: userId},
        team : {id: project.team.id}
    }
  });
   if (!membership) {
    throw new AppError("You are not allowed to update this project", 403);
  }
  const isAllowed = membership.role === "admin" ||  membership.isOwner ;


  if (!isAllowed) {
    throw new AppError("Only admin or owner can delete projects", 403);
  }

  await projectRepository.remove(project);
  return true;
};