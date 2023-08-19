import express, {Express, Request, Response } from "express";
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { firebaseInit } from "./src/util/firebase/firebase"
import {AuthRestController} from "./src/adapter/in/rest/authentication/controller/controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 9003;

const cors = require("cors")
app.use(bodyParser.json())
app.use(cors())

firebaseInit()

const authRestController: AuthRestController = new AuthRestController(app)
authRestController.init()

app.get('/', (req: Request, res: Response) => {
    res.json({
        status: true,
        message: `running on port ${port}`
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});