import { AppDataSource  } from "../../config/data-source.js";
import { AppError } from "../../utils/AppError.js";
import { TeamMember } from "../../entities/TeamMember.js";
import { User } from "../../entities/User.js";
import { userResponseDto } from "../../dtos/user.dto.js";
import { authorizeTeamMember } from "../../utils/authorization.js";

const teamMemberRepository = AppDataSource.getRepository(TeamMember);
const userRepository = AppDataSource.getRepository(User);

export const getTeamMembersService = async ({teamId, userId}) => {
    const currentUserMembership  = await teamMemberRepository.findOne({
        where : {
            team : {id : teamId},
            user : {id : userId}
        },
    });

    if (!currentUserMembership) {
    throw new AppError("Team not found or you are not a member", 404);
    }
    console.log("REQUEST teamId:", teamId);

 const members = await teamMemberRepository.find ({
        where: { team : {id: teamId}},
        relations : {user : true, team: true},
        order : {createdAt : "ASC"},
    
    });

  console.log("members length:", members.length);
    console.log(members.map((m) => ({
      memberId: m.id,
      teamId: m.team?.id,
      userId: m.user?.id,
    })));

  return members.map((member) => ({
    ...userResponseDto(member.user),
    role: member.role,
    isOwner: member.isOwner,
  }));
};


export const addMemberService = async ({teamId, currentUserId, email, role}) => {
    const membership = await teamMemberRepository.findOne({
        where: {
            team: {id: teamId}, 
            user : {id: currentUserId}
        },
    });
    if (!membership) {
            throw new AppError("Team not found or you are not a member", 404);
  }
    authorizeTeamMember(membership, ["admin"], {
      message: "Only admin or owner can add members",
    }); 

const userToAdd = await  userRepository.findOne({
    where : {
        email: email
    }
  });
  if (!userToAdd) {
        throw new AppError("User with this email does not exist", 404);
  }

  const existingMemberShip = await teamMemberRepository.findOne({
    where : {
        team : {id: teamId},
        user: {id: userToAdd.id},
    }
  });
    if (existingMemberShip) {
    throw new AppError("User is already a member of this team", 409);
  }

  const newMembership = teamMemberRepository.create({
    team : {id: teamId},
    user: userToAdd,
    role,
    isOwner: false
  });
  await teamMemberRepository.save(newMembership);

    return {
    ...newMembership,
    user: userResponseDto(newMembership.user),
  };
};


export const changeMemberRoleService  = async ({teamId, currentUserId, memberId, role}) => {
  const currentUserMembership = await teamMemberRepository.findOne ({
        where : {
            team : {id : teamId},
            user : {id : currentUserId}
        }
    });
  if (!currentUserMembership) {
    throw new AppError("Team not found or you are not a member", 404);
  }
    authorizeTeamMember(currentUserMembership, ["admin"], {
      message: "Only admin or owner can change member roles",
    });
  const memberToUpdate  = await  teamMemberRepository.findOne({
        where : {
            team : {id : teamId},
            user : {id : memberId }
        },
        relations : {user: true}
  });
  if (!memberToUpdate) {
    throw new AppError("Member not found in this team", 404);
  }
  if (memberToUpdate.isOwner) {
    throw new AppError("Cannot change owner role", 403);
  }
  
  memberToUpdate.role = role;
  await teamMemberRepository.save(memberToUpdate);
    return {
      ...memberToUpdate,
      user: userResponseDto(memberToUpdate.user),
    };

};

export const removeMemberService  = async ({teamId, currentUserId, memberId}) => {
  console.log ("teamId",teamId);
  console.log ("currentUserId",currentUserId);
  console.log ("memberId",memberId);
  const currentUserMembership = await teamMemberRepository.findOne ({
        where : {
            team : {id : teamId},
            user : {id : currentUserId}
        }
    });
  if (!currentUserMembership) {
    throw new AppError("Team not found or you are not a member", 404);
  }
    authorizeTeamMember(currentUserMembership, ["admin"], {
      message: "Only admin or owner can remove members",
    });
  const memberToRemove   = await  teamMemberRepository.findOne({
        where : {
            team : {id : teamId},
            user : {id : memberId }
        },
  });
  if (!memberToRemove) {
    throw new AppError("Member not found in this team", 404);
  }

  if (memberToRemove.isOwner) {
    throw new AppError("Cannot remove team owner", 403);
  }
  
  await teamMemberRepository.remove(memberToRemove);
  return true;


};
