import {UserCredential} from "../../../../../domain/user_credential";

export interface BaseFirebaseAuthRepository{
    signInWithEmailPassword (email:string, password:string, traceId?:string) : Promise<UserCredential>
    registerWithEmailPassword(email:string, password:string, traceId?:string): Promise<UserCredential>
}