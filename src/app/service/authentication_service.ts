import {UseCaseAuthentication} from "../port/in/authentication_use_case";
import {UserCredential} from "../../domain/user_credential";
import {FirebaseAuthAdapter} from "../../adapter/in/firebase/auth/adapter/adapter";
import {logger} from "../../util/logger/logger";

export class AuthenticationService implements UseCaseAuthentication{
    private firebaseAuthAdapter

    constructor() {
        this.firebaseAuthAdapter = new FirebaseAuthAdapter()
    }

    async login(email: string, password: string, traceId?: string | undefined): Promise<UserCredential>{
        try{
            const credential: UserCredential = await this.firebaseAuthAdapter.getToken(email, password, traceId)
            return Promise.resolve(credential)
        }catch (e: any){
            // logger.error(e.toString(), traceId)
            return Promise.reject(e.toString())
        }
    }

    async register(email: string, password: string, traceId?: string | undefined): Promise<UserCredential> {
        try{
            const credential: UserCredential = await this.firebaseAuthAdapter.registerToken(email, password, traceId)
            return Promise.resolve(credential)
        }catch(e: any){
            logger.error(e.toString(), traceId)
            return Promise.reject(e.toString())
        }
    }
}