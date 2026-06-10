import { createTaskService,getProjectTasksService,getTaskByIdService,updateTaskService,deleteTaskService,updateTaskStatusService } from "./tasks.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService({
      projectId: req.params.projectId,
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      assignedToId: req.body.assignedToId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getProjectTasks = async (req, res, next) => {
  try {
    const tasks = await getProjectTasksService({
      projectId: req.params.projectId,
      userId: req.user.id,
    filters: {
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
   },
   sorting : {
    sortBy: req.query.sortBy,
    order: req.query.order,
   }
    });

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: {
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const getTaskById = async (req, res, next) => {
  try {
    const task = await getTaskByIdService({
      taskId: req.params.taskId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService({
      taskId: req.params.taskId,
      userId: req.user.id,
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const deleteTask = async (req, res, next) => {
  try {
    await deleteTaskService({
      taskId: req.params.taskId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await updateTaskStatusService({
      taskId: req.params.taskId,
      userId: req.user.id,
      status: req.body.status,
    });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};