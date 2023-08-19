import {UserCredential} from "../../../domain/user_credential";

export interface UseCaseAuthentication{
    login(email:string, password: string, traceId?:string): Promise<UserCredential>
    register(email: string, password: string, traceId?: string): Promise<UserCredential>
}