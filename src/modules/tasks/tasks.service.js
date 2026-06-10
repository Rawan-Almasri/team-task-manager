import { AppDataSource } from "../../config/data-source.js";

import { Task } from "../../entities/Task.js";
import { Project } from "../../entities/Project.js";
import { TeamMember } from "../../entities/TeamMember.js";
import { User } from "../../entities/User.js";

import { AppError } from "../../utils/AppError.js";
import { userResponseDto } from "../../dtos/user.dto.js";
import { authorizeTeamMember } from "../../utils/authorization.js";
import { ILike } from "typeorm";

const taskRepository = AppDataSource.getRepository(Task);
const projectRepository = AppDataSource.getRepository(Project);
const teamMemberRepository = AppDataSource.getRepository(TeamMember);
const userRepository = AppDataSource.getRepository(User);


export const createTaskService = async ({ projectId, userId, title, description, priority, assignedToId,}) => {
  const project = await projectRepository.findOne({
    where: {  id: projectId,  },
    relations: {
      team: true,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const currentUserMembership = await teamMemberRepository.findOne({
    where: {
      team: { id: project.team.id },
      user: { id: userId },
    },
    relations: {
      user: true,
    },
  });

  if (!currentUserMembership) {
    throw new AppError("You are not a member of this project team", 403);
  }

        authorizeTeamMember(currentUserMembership, ["admin", "manager"], {
        message: "Only admin or manager can create tasks",
      }); 
  let assignedUser = null;

  if (assignedToId) {
    assignedUser = await userRepository.findOne({
      where: {
        id: assignedToId,
      },
    });

    if (!assignedUser) {
      throw new AppError("Assigned user not found", 404);
    }

    const assignedUserMembership = await teamMemberRepository.findOne({
      where: {
        team: { id: project.team.id },
        user: { id: assignedToId },
      },
    });

    if (!assignedUserMembership) {
      throw new AppError("Assigned user is not a member of this team", 400);
    }
  }

  const task = taskRepository.create({ title, description,  priority, project,
     createdBy: currentUserMembership.user,
    assignedTo: assignedUser,
  });

  await taskRepository.save(task);

  return task;
};


export const getProjectTasksService = async ({ 
  projectId, userId, filters, sorting

}) => {
  const project = await projectRepository.findOne({
    where: {   id: projectId,   },
    relations: {
      team: true,
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
    throw new AppError("You are not allowed to view tasks in this project", 403);
  }

  const tasks = await taskRepository.find({
    where: {
      project: { id: projectId },
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && {priority: filters.priority, }),
     ...(filters.search && { title: ILike(`%${filters.search}%`),}),

    },
    order: {
      ...(sorting.sortBy 
        ? { [sorting.sortBy]: sorting.order || "ASC" } 
        : {createdAt: "DESC",}
      ),
    },
    relations: {
      createdBy: true,
      assignedTo: true,
    },
  });

    return tasks.map((task) => ({
      ...task,
      createdBy: userResponseDto(task.createdBy),
      assignedTo: userResponseDto(task.assignedTo),
    }));
};

export const getTaskByIdService = async ({ taskId, userId }) => {
  const task = await taskRepository.findOne({
    where: {
      id: taskId,
    },
    relations: {
      project: {
        team: true,
      },
      createdBy: true,
      assignedTo: true,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: task.project.team.id },
      user: { id: userId },
    },
  });

  if (!membership) {
    throw new AppError("You are not allowed to view this task", 403);
  }
    return {
      ...task,
      createdBy: userResponseDto(task.createdBy),
      assignedTo: userResponseDto(task.assignedTo),
    };

};


export const updateTaskService = async ({ taskId, userId, data }) => {
  const task = await taskRepository.findOne({
    where: { id: taskId, },
    relations: {
      project: {team: true,},
      assignedTo: true,
      createdBy: true,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: task.project.team.id },
      user: { id: userId },
    },
  });

  if (!membership) {
    throw new AppError("You are not allowed to update this task", 403);
  }

  authorizeTeamMember(membership, ["admin", "manager"], {
    message: "Only admin or manager can update tasks",
  });

  if (data.title !== undefined) {
    task.title = data.title;
  }

  if (data.description !== undefined) {
    task.description = data.description;
  }

  if (data.status !== undefined) {
    task.status = data.status;
  }

  if (data.priority !== undefined) {
    task.priority = data.priority;
  }

  if (data.assignedToId !== undefined) {
    if (data.assignedToId === null || data.assignedToId === "") {
      task.assignedTo = null;
    } else {
      const assignedUser = await userRepository.findOne({
        where: {
          id: data.assignedToId,
        },
      });

      if (!assignedUser) {
        throw new AppError("Assigned user not found", 404);
      }

      const assignedUserMembership = await teamMemberRepository.findOne({
        where: {
          team: { id: task.project.team.id },
          user: { id: data.assignedToId },
        },
      });

      if (!assignedUserMembership) {
        throw new AppError("Assigned user is not a member of this team", 400);
      }

      task.assignedTo = assignedUser;
    }
  }

  await taskRepository.save(task);

  return {
    ...task,
    createdBy: userResponseDto(task.createdBy),
    assignedTo: userResponseDto(task.assignedTo),
  };
};



export const deleteTaskService = async ({ taskId, userId }) => {
  const task = await taskRepository.findOne({
    where: {
      id: taskId,
    },
    relations: {
      project: {
        team: true,
      },
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: task.project.team.id },
      user: { id: userId },
    },
  });

  if (!membership) {
    throw new AppError("You are not allowed to delete this task", 403);
    }

    authorizeTeamMember(membership, ["admin", "manager"], {
      message: "Only admin or manager can delete tasks",
    });
  await taskRepository.remove(task);

  return true;
};



export const updateTaskStatusService = async ({ taskId, userId, status }) => {
  const task = await taskRepository.findOne({
    where: { id: taskId},
    relations: {
      project: { team: true,},
      assignedTo: true,
      createdBy: true,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const membership = await teamMemberRepository.findOne({
    where: {
      team: { id: task.project.team.id },
      user: { id: userId },
    },
  });

  if (!membership) {
    throw new AppError("You are not allowed to update this task", 403);
  }

  const isAdminOrManagerOrOwner =
    membership.role === "admin" ||
    membership.role === "manager" ||
    membership.isOwner === true;
q
  const isAssignedUser = task.assignedTo && task.assignedTo.id === userId;

  if (!isAdminOrManagerOrOwner && !isAssignedUser) {
    throw new AppError(
      "Only admin, manager, owner, or assigned user can update task status",
      403
    );
  }

  task.status = status;

  await taskRepository.save(task);

  return {
    ...task,
    createdBy: userResponseDto(task.createdBy),
    assignedTo: userResponseDto(task.assignedTo),
  };  
};