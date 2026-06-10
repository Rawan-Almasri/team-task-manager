import {getDashboardStatsService,getMyAssignedTasksService} from "./dashboard.service.js";

export const getDashboardStats  = async (req, res,next) => {
    try {
        const states = await getDashboardStatsService(req.user.id);
        res.status(200).json( {
             success: true,
            message: "Dashboard stats retrieved successfully",  
            data : { states }

        });
    } catch (error) {
        next(error);
    }
};

export const getMyAssignedTasks = async (req, res,next) => {
    try {
        const tasks = await getMyAssignedTasksService({
            userID: req.user.id, 
      filters: {
        status: req.query.status,
        priority: req.query.priority,
        search: req.query.search,
      },
            sorting: {
                sortBy: req.query.sortBy,
                order: req.query.order,
            }
        });
        res.status(200).json({
            success: true,
      message: "My assigned tasks fetched successfully",
            data: { tasks }
        });
    } catch (error) {
        next(error);
    }
};