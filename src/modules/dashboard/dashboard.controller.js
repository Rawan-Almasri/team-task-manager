import {getDashboardStatsService} from "./dashboard.service.js";

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