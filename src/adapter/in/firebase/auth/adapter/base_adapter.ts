import {UserCredential} from "../../../../../domain/user_credential";

export interface BaseFirebaseAuthAdapter{
    getToken(email:string, password:string, traceId?:string): Promise<UserCredential>
}