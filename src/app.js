import express from "express"; 
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js"
import teamsRoutes from "./modules/teams/teams.routes.js";
import membersRoutes from "./modules/Team Members/members.routes.js";
import projectsRoutes from "./modules/projects/projects.routes.js";
import tasksRoutes from "./modules/tasks/tasks.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
const app = express ();  //you got error here
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/teams", teamsRoutes);
app.use("/api/v1", membersRoutes);
app.use("/api/v1", projectsRoutes);
app.use("/api/v1", tasksRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;