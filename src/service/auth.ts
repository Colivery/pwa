import { inject, injectable } from "springtype/core/di";
import { CryptoService } from "./crypto";
import { FirebaseService } from "./firebase";
import { FIREBASE_CONFIG } from "../config/firebase";
import { st } from "springtype/core";
import { StorageService } from "./storage";
import { ConsumerOrderListPage } from "../page/consumer-order-list/consumer-order-list";

export interface IUserContext {
    userId: string;
    email: string;
}

@injectable
export class AuthService {

    @inject(CryptoService)
    cryptoService: CryptoService;

    @inject(StorageService)
    storageService: StorageService;

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService; // leads to: new FirebaseService(FIREBASE_CONFIG)

    userContext: IUserContext;

    userCredential: firebase.auth.UserCredential;

    async isLoggedIn() {
        await this.autoLogin();
        return this.firebaseService.isLoggedIn();
    }

    storeCredentials(email: string, passwordHash: string) {
        this.storageService.set('email', email);
        this.storageService.set('password-hash', passwordHash);
    }

    getPasswordHash() {
        return this.storageService.get('password-hash') || 'default';
    }

    getEmail() {
        return this.storageService.get('email');
    }

    async autoLogin() {

        const email = this.getEmail();
        const passwordHash = this.getPasswordHash();

        try {
            if (email && passwordHash) {
                this.userCredential = await this.firebaseService.auth().signInWithEmailAndPassword(email, passwordHash);
                this.userContext = { userId: this.userCredential.user.uid, email: email };
                return true;
            }
        } catch (e) {
            st.debug('error in login', e)
        }
        return false;
    }

    async sendEmailVerification() {
        this.firebaseService.auth().currentUser.sendEmailVerification();
    }

    async login(email: string, password: string) {
        const passwordHash = this.cryptoService.hash(password);
        const result = await this.firebaseService.auth().signInWithEmailAndPassword(email, passwordHash);
        this.userContext = { userId: result.user.uid, email: email };
        this.storeCredentials(email, passwordHash);

        st.route = {
            path: ConsumerOrderListPage.ROUTE
        };
    }

    async logout() {
        await this.firebaseService.logout();
        this.storeCredentials('', '');

        window.location.href = window.location.href.split('/')[0];
    }

    async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
        this.firebaseService.auth().useDeviceLanguage();
        const passwordHash = this.cryptoService.hash(password);
        const result = await this.firebaseService.auth().createUserWithEmailAndPassword(email, passwordHash);
        this.userContext = { userId: result.user.uid, email: email };
        this.storeCredentials(email, passwordHash);
        //this.sendEmailVerification();
        return result;
    }

    async getIdToken() {
        return this.firebaseService.auth().currentUser.getIdToken();
    }
}

// quick & dirty hack because DI has a bug
window.authService = new AuthService();

declare global {
    interface Window {
        authService: AuthService;
    }
}