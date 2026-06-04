import app from './app.js'
import { env } from "./config/env.js";
import { AppDataSource } from "./config/data-source.js";
//import { en } from "zod/locales";

const startServer = async ()=> {

    try {
        await AppDataSource.initialize();
        console.log ("Database connected successfully"); 

       /* app.listen (env.port, () => {
          console.log(`Server is running on port ${env.port}`);
        });*/

        const server = app.listen(env.port, () => {
             console.log(`Server is running on port ${env.port}`);
            });
           
            server.on("error", (error) => {
                console.error("Server error:", error);
            });

    } catch (error) {
        console.error ("Faild to start server"); 
        console.error (error);
        process.exit (1);
    }

};

startServer();