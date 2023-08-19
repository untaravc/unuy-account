import {BaseFirebaseAuthAdapter} from "./base_adapter";
import {UserCredential} from "../../../../../domain/user_credential";
import {BaseFirebaseAuthRepository} from "../repository/base_repository";
import {FirebaseAuthRepository} from "../repository/repository";

export class FirebaseAuthAdapter implements BaseFirebaseAuthAdapter {
    private repository: BaseFirebaseAuthRepository

    constructor() {
        this.repository = new FirebaseAuthRepository()
    }

    getToken(email: string, password: string, traceId?: string): Promise<UserCredential> {
        return this.repository.signInWithEmailPassword(email, password, traceId)
    }

    registerToken(email: string, password: string, traceId?: string | undefined): Promise<UserCredential> {
        return this.repository.registerWithEmailPassword(email, password, traceId);
    }
}