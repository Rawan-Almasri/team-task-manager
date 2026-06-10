import {
  createProjectService,
  getTeamProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService
} from "./projects.service.js";

export const createProject = async (req, res, next) => {
    try {
        const project = await createProjectService({
      teamId: req.params.teamId,
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
        });
            res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        project,
      },
    });

    } catch (error) {
        next (error);
    }
}

export const getTeamProjects = async (req, res, next) => {
  try {
    const projects = await getTeamProjectsService({
      teamId: req.params.teamId,
      userId: req.user.id,
      sorting : { 
        sortBy: req.query.sortBy,
        order: req.query.order
      }
    });

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getProjectById = async (req, res, next) => {
  try {
    const project = await getProjectByIdService({
      projectId: req.params.projectId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await updateProjectService({
      projectId: req.params.projectId,
      userId: req.user.id,
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await deleteProjectService({
      projectId: req.params.projectId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};