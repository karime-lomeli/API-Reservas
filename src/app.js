import express from "express";
import morgan from "morgan";
let cors = require('cors');

//Routes
import salasRoutes from "./routes/salas.routes";

const app=express();

//settings
app.set("port",4000);


//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/salas",salasRoutes);

export default app;
