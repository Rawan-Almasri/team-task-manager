import { success } from "zod";
import { createTeamService,getMyTeamService,getTeamByIdService,updateTeamService,deleteTeamService } from "./teams.service.js";

export const createTeam = async (req, res, next) => {
  try {
    const result = await createTeamService({
      name: req.body.name,
      description: req.body.description,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTeams = async (req,res,next) => {
  try {
    const teams = await getMyTeamService(req.user.id);
    res.status (200).json({
      success : true, 
      message: "Teams fetched",
      data : {
        teams,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req,res,next) => {
  try {
    const team = await getTeamByIdService ({
      teamId: req.params.teamId,
      userId: req.user.id
    });
    res.status(200).json({
      success: true,
      message: "Team fetched successfully",
      data: {
        team,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req,res,next) => {

  try {
    const team = await updateTeamService ({
      teamId: req.params.teamId,
      userId: req.user.id,
      data: req.body
    });
    res.status(200).json({
      success: true,
      message: "Team updated",
      data: {team}
    });
  } catch (error) {
    next(error);
  }
};


export const deleteTeam = async (req,res,next) => {
  try {
    await deleteTeamService ({
      teamId: req.params.teamId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  
  } catch (error) {
    next(error);
  }
};