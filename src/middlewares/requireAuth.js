import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

const userRepository = AppDataSource.getRepository(User);

export const requireAuth = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }  

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const user = await userRepository.findOne ({
        where : {
            id: userId,
        }
    });

    if (!user) {
    throw new AppError("User no longer exists", 401);
    }
    delete user.password;

    req.user = user;

    next();

    } catch (error) {
    next(error);
    }
}