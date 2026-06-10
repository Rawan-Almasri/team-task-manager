import { AppDataSource } from "../../config/data-source.js";
import { Project } from "../../entities/Project.js";
import { TeamMember } from "../../entities/TeamMember.js";
import { AppError } from "../../utils/AppError.js";
import { userResponseDto } from "../../dtos/user.dto.js";
import { authorizeTeamMember } from "../../utils/authorization.js";

import { buildSorting } from "../../utils/buildSorting.js";


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

  authorizeTeamMember(membership, ["admin", "manager"], {
    message: "Only admin or manager can create projects",
  });

  const project = projectRepository.create ({
    name,
    description,
    team: membership.team,
    createdBy: membership.user,
  })
  await projectRepository.save(project);


  return {
    ...project,
    createdBy: userResponseDto(membership.user),
  };
};


export const getTeamProjectsService = async ({ 
  teamId, userId , sorting
}) => {
  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: teamId },
      user: { id: userId },
    },
  });

  authorizeTeamMember(membership, ["admin", "manager", "member"], {
    message: "You are not allowed to view this team's projects",
  });

  const projects = await projectRepository.find({
    where: {
      team: { id: teamId },
    },
    relations: {
      createdBy: true, 
    },
    order: buildSorting(
      sorting?.sortBy,
      sorting?.order
    ),
  });

    return projects.map((project) => ({
      ...project,
      createdBy: userResponseDto(project.createdBy),
    }));

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

  authorizeTeamMember(membership, ["admin", "manager", "member"], {
    message: "You are not allowed to view this project",
  });

    return {
    ...project,
     createdBy: userResponseDto(project.createdBy),
    };

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

    authorizeTeamMember(membership, ["admin", "manager"], {
      message: "Only admin or manager can update projects",
    });

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
    throw new AppError("You are not allowed to delete this project", 403);
  }

  authorizeTeamMember(membership, ["admin"], {
    message: "Only admin or owner can delete projects",
  });

  await projectRepository.remove(project);
  return true;
};