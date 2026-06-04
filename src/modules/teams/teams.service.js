import { AppDataSource } from "../../config/data-source.js";

import { Team } from "../../entities/Team.js";
import { TeamMember } from "../../entities/TeamMember.js";
import { AppError } from "../../utils/AppError.js";

const teamRepository = AppDataSource.getRepository(Team);
const teamMemberRepository = AppDataSource.getRepository(TeamMember);


export const createTeamService = async ({ name, description, user }) => {
  const team = teamRepository.create({
    name,
    description,
  });

  await teamRepository.save(team);

  const membership = teamMemberRepository.create({
    user,
    team,
    role: "admin",
    isOwner: true,
  });

  await teamMemberRepository.save(membership);

  return {
    team,
    membership,
  };
};


export const getMyTeamService = async (userId) => {
  const membership = await teamMemberRepository.find({
    where : {
      user : {id : userId}
    }, 
  relations : {team: true,},
  order : { createdAt : "DESC" },
  });
  return membership.map((membership) => ({
    ...membership.team,
    /*
      id: membership.team.id,
  name: membership.team.name,
  description: membership.team.description
}*/
    role: membership.role,
    isOwner: membership.isOwner
  }));
};

export const getTeamByIdService = async ({teamId, userId}) => {
  console.log("teamId:", teamId);
console.log("userId:", userId);
  const membership = await teamMemberRepository.findOne({
    where : {
      user : {id:userId}, 
      team : {id : teamId},
        },
        relations: {
          user: true,
          team: true,
    }
  });
  if (!membership) {
    throw new AppError("Team not found or you are not a member", 404);
  }

  return membership;
};

export const updateTeamService = async ({teamId, userId, data}) => {
  const membership = await teamMemberRepository.findOne({
    where: {
      team : {id: teamId},
      user: {id: userId}
    },
    relations : {team: true}
  });
  if (!membership) {
    throw new AppError("Team not found or you are not a member", 404);
  }
  const isAllowed = membership.isOwner || membership.role === "admin";
  if  (!isAllowed) {
        throw new AppError("You are not allowed to update this team", 403);
  }
  if (data.name !== undefined) {
    membership.team.name = data.name;
  }
  if (data.description !== undefined) {
    membership.team.description = data.description;
  }

  await teamRepository.save(membership.team);

  return membership.team;

};

export const deleteTeamService = async ({userId,teamId}) => {
  const membership = await teamMemberRepository.findOne({
    where : {
      user: {id: userId},
      team: {id: teamId}
    },
    relations : {team: true}
  });
  if (!membership) {
    throw new AppError("Team not found or you are not a member", 404);
  }
  if (!membership.isOwner) {
      throw new AppError("Only team owner can delete this team", 403);
  }

  await teamRepository.remove(membership.team);

  return true;
};