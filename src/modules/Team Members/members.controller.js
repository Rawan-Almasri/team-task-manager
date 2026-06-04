
import { getTeamMembersService, addMemberService, changeMemberRoleService,removeMemberService} from "./members.service.js";


export const getTeamMembers = async (req,res,next) => {
    try {
        const members = await getTeamMembersService({
            teamId: req.params.teamId,
            userId: req.user.id,
        });
    res.status(200).json ({
        success: true,
      message: "Team members fetched successfully",
      data: {
        members,
      },
    });
    } catch (error) {
        next (error);
    }
};
export const addMember =async (req,res,next) => {
try {
    const membership = await addMemberService({
        teamId: req.params.teamId,
        currentUserId: req.user.currentUserId,
        email: req.body.email,
        role: req.body.role
    });
    res.status(201).json ({
        
      message: "Member added successfully",
      data: {
        membership,
      },
    });
} catch (error) {
    next(error);
}
};

export const changeMemberRole = async (req,res,next) => {
    try {
        const member = await changeMemberRoleService({
            currentUserId : req.user.id,
            teamId: req.params.teamId,
            memberId: req.body.memberId,
            role: req.body.role,
        });
    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: {
        member,
      },
    });
        
    } catch (error) {
        next (error);
    }
}; 


export const removeMember = async (req,res,next) => {
    try {
       await  removeMemberService({
        teamId: req.params.teamId,
        currentUserId: req.user.id,
        memberId: req.params.memberId
       });

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
    } catch (error) {
        next (error);
    }
};