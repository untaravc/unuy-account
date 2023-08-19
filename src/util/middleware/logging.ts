import {NextFunction, Request, Response} from "express";
import {v4 as uuidv4} from "uuid"

export const loggingMiddleware = async (req: Request, res: Response, next: NextFunction)=>{
    const traceId = uuidv4()
    return next()
}