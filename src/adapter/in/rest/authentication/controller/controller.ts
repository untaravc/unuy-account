import {BaseController} from "../../../../../common/base_controller";
import {Express, Request, Response} from "express";
import {UseCaseAuthentication} from "../../../../../app/port/in/authentication_use_case";
import {AuthenticationService} from "../../../../../app/service/authentication_service";
import {UserCredential} from "../../../../../domain/user_credential";
import {RestResponse} from "../../../../../domain/rest_response";
import {dataToRestResponse, errorToRestResponse} from "../../../../../util/rest/converter";
import {getLogTraceId, logger} from "../../../../../util/logger/logger";
import {loggingMiddleware} from "../../../../../util/middleware/logging";

export class AuthRestController implements BaseController{
    private app: Express
    private service:UseCaseAuthentication

    constructor(app:Express) {
        this.app = app
        this.service = new AuthenticationService()
    }

    init(){
        this.app.post('/auth/login', loggingMiddleware, async (req: Request, res:Response)=>{
            try{
                const email: string = req.body.email !== undefined ? req.body.email.toString() : '';
                const password: string = req.body.password !== undefined ? req.body.password.toString() : '';
                const result: UserCredential = await this.service.login(email, password)
                const response: RestResponse = dataToRestResponse(result)
                res.json(response)
            } catch (e:any){
                logger.error(e)
                res.status(500).json(errorToRestResponse(e))
            }
        })

        this.app.post('/auth/register', loggingMiddleware, async (req:Request, res:Response) => {
            try{
                const email: string = req.body.email !== undefined ? req.body.email.toString() : ''
                const password: string = req.body.password !== undefined ? req.body.password.toString() : ''
                const result: UserCredential = await this.service.register(email, password, getLogTraceId())
                const response: RestResponse = dataToRestResponse(result)
                res.json(response)
            }catch(e:any){
                logger.error(e)
                res.status(500).json(errorToRestResponse(e))
            }
        })

        this.app.post('/auth/login', loggingMiddleware, async (req:Request, res:Response) => {
            try{
                const email: string = req.body.email !== undefined ? req.body.email.toString() : ''
                const password: string = req.body.password !== undefined ? req.body.password.toString() : ''
                const result: UserCredential = await this.service.login(email, password, getLogTraceId())
                const response: RestResponse = dataToRestResponse(result)
                res.json(response)
            }catch(e:any){
                logger.error(e)
                res.status(500).json(errorToRestResponse(e))
            }
        })
    }
}