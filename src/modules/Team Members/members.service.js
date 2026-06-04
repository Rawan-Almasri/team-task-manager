import { AppDataSource  } from "../../config/data-source.js";
import { AppError } from "../../utils/AppError.js";
import { TeamMember } from "../../entities/TeamMember.js";
import { User } from "../../entities/User.js";


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
  id: member.user.id,
  name: member.user.name,
  email: member.user.email,
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
  const isAllowed = membership.isOwner || membership.role === 'admin';
  if (!isAllowed) {
        throw new AppError("Only admin or owner can add members", 403);
  }
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
  delete newMembership.user.password;
  return newMembership;

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
    const isAllowed = currentUserMembership.isOwner || currentUserMembership.role === 'admin';
  if (!isAllowed) {
        throw new AppError("Only admin or owner can add members", 403);
  }
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
  delete memberToUpdate.user.password;
  return memberToUpdate;


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
    const isAllowed = currentUserMembership.isOwner || currentUserMembership.role === 'admin';
  if (!isAllowed) {
    throw new AppError("Only admin or owner can remove members", 403);
  }
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
