import { AppDataSource } from "../../config/data-source.js";
import { AppError } from "../../utils/appError.js"
import { User } from "../../entities/User.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async  ({name, email, password}) => {
    const existingUser = await userRepository.findOne ({
        where : {email}
    });
    if (existingUser) {
        throw new AppError ("Email is already token", 409);
    }
    const hashedPassword = await hashPassword(password);
    const user = userRepository.create({
        name: name,
        email: email,
        password: hashedPassword
    });
    await userRepository.save(user);
    delete user.password; /////////
    return user;
};

export const loginUser = async ({email, password}) => {
    const user = await userRepository.findOne({
        where : {email}
    });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await comparePassword(password,user.password);

    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }

///if data is correct create token
    const token = signToken({
    userId: user.id,
  });

//delete password so you don't return it 
    delete user.password;

    // return user data and token
    return {user, token};

};