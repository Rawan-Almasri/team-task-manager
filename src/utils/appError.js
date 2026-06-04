export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super (message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
} 

/*
import { AppError } from "./utils/AppError.js";

function getUser(id) {
  if (!id) {
    throw new AppError("User ID is required", 400);
  }
}
  
try {
  getUser();
} catch (err) {
  console.log(err.message);      // User ID is required
  console.log(err.statusCode);   // 400
  console.log(err.isOperational);// true
}

*/
