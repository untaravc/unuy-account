import * as admin from "firebase-admin"
import {BaseFirebaseAuthRepository} from "./base_repository";
import {UserCredential} from "../../../../../domain/user_credential";
import {getFirebaseAppClient} from "../../../../../util/firebase/firebase";
import {getAuth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import {UserCredential as Credential} from "firebase/auth"
import {UserToken} from "../../../../../domain/user_token";
import moment from "moment";
import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {UserFirestore} from "../../../../../domain/user_firestore";

export class FirebaseAuthRepository implements BaseFirebaseAuthRepository{
    async signInWithEmailPassword(email: string, password: string, traceId?: string): Promise<UserCredential> {
        const token = await this.getLoginToken(email,password,traceId)
        await this.insertToken(token, email, password, traceId)
        return await this.verifyToken(token, traceId)
    }

    async registerWithEmailPassword(email:string, password:string, traceId: string):Promise<UserCredential>{
        // Membuat akun di Firebase.Authentication
        // const token = await this.getRegisterToken(email, password, traceId)
        const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzODBlZjEyZjk1ZjkxNmNhZDdhNGNlMzg4ZDJjMmMzYzIzMDJmZGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdW51eS1pbnRlcm5hbCIsImF1ZCI6InVudXktaW50ZXJuYWwiLCJhdXRoX3RpbWUiOjE2OTIzNTY0OTcsInVzZXJfaWQiOiJPaVRwejV0QWhCZTVWaHNqZ2pqU0Q3TjV6Tm0yIiwic3ViIjoiT2lUcHo1dEFoQmU1VmhzamdqalNEN041ek5tMiIsImlhdCI6MTY5MjM1NjQ5OCwiZXhwIjoxNjkyMzYwMDk4LCJlbWFpbCI6InZ5dnkxNzc3KzFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInZ5dnkxNzc3KzFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.RGZwKS6ektbfvSg5z0vH2K5SoFdC5pmzOQxFS0OUyTjG9WHQKQtOLMn4OJHdvVL0FSuLW7lTxyb2po1EVG7Ng1YOeUBQENp5adWZVG88o3_ElRaSmuwAvEuP9Av90war_AOZ0N0pMyzch60YBlO2y1sEfPWeZHRo3o7xmqb_mNWZyjARMWeo-H\n" +
            "me7Su9Q3_2POj0qnv3ajhBYyWnQBBXb2cw9Yr1qnS89eXXnjeXvcHcm5w4Ujpx1RyW6IDPiK6orxkJRkdUW9THoIgdT7vJBjqyx4KI9LQ5qnj-u7U64S6TTB2alGHNjUwleACbB0uzUjtgZNmBg_3fCWtE-ZEDfA"
        // await this.insertToken(token,email,password)
        return this.verifyToken(token,traceId)
    }

    private async getLoginToken(email: string, password: string, traceId?:string){
        const app = getFirebaseAppClient()
        const auth = getAuth(app)

        return signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential: Credential)=>{
                const user: User = userCredential.user;
                const token: string = await user.getIdToken(true)
                return Promise.resolve(token)
            })
            .catch((error)=>{
                console.log(error)
                return Promise.reject(error.message)
            })
    }

    async insertToken(token:string, email:string, password, traceId?:string): Promise<UserToken>{
        const db = admin.firestore()
        const now = new Date()
        const expiration = moment(now).add(2, 'hours').toDate()
        const encoded = this.encode(`${email}:${password}`, traceId)

        await db.collection('tokens')
            .doc(token)
            .create({
                value: encoded,
                expired_at: expiration
            })

        return {
            token,
            expiredAt: expiration,
        }
    }

    async verifyToken(token: string, traceId?:string): Promise<UserCredential>{
        try {
            const decoded: DecodedIdToken = await admin.auth().verifyIdToken(token)
            const email: string = decoded.email ? decoded.email : ''
            console.log(email)
            const user = await this.getUserDetail(email, traceId)

            if(user == null){
                return Promise.reject("verifyToken: user not found")
            }

            return Promise.resolve({
                id: 'user.id',
                email: 'user.email',
                name: 'user.name',
                role: 'user.role',
                token: token
            })

        }catch (e){

        }
    }

    private async getUserDetail(email: string, traceId?:string): Promise <UserFirestore | null>{
        const db = admin.firestore()
        const snapshot = await db.collection('users')
            .where('email','==',email)
            .get()

        if(snapshot.empty){
            return null
        }

        return {
            id: snapshot.docs[0].id,
            email:snapshot.docs[0].data().email,
            name:snapshot.docs[0].data().email,
            role:snapshot.docs[0].data().email,
        }
    }

    private encode(value:string, traceId?: string){
        const buff = Buffer.from(value)
        return buff.toString("base64")
    }

    private decode(value:string, traceId?:string){
        const buff = Buffer.from(value)
        return buff.toString('ascii')
    }

    private getRegisterToken(email: string, password: string, traceId: string){
        const app = getFirebaseAppClient()
        const auth = getAuth(app)

        return createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential: Credential)=>{
                const user: User = userCredential.user
                const token: string = await user.getIdToken(true)
                console.log("Token saat pembuatan akun", token)
                return Promise.resolve(token)
            }).catch((error)=>{
                console.log(error)
                return Promise.reject(error.message)
            })
    }
}