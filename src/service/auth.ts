import { inject, injectable } from "springtype/core/di";
import { CryptoService } from "./crypto";
import { FirebaseService } from "./firebase";
import { FIREBASE_CONFIG } from "../config/firebase";
import { st } from "springtype/core";
import { StorageService } from "./storage";
import { ConsumerOrderListPage } from "../page/consumer-order-list/consumer-order-list";
import { PreferenceService } from "./preference";

export interface IUserContext {
    userId: string;
    email: string;
}

@injectable
export class AuthService {

    static readonly KEY_EMAIL = 'email';
    static readonly KEY_PASSWORD_HASH = 'password-hash';

    @inject(CryptoService)
    cryptoService: CryptoService;

    @inject(StorageService)
    storageService: StorageService;

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService; // leads to: new FirebaseService(FIREBASE_CONFIG)

    userContext: IUserContext;

    userCredential: firebase.auth.UserCredential;

    constructor() {
        this.firebaseService.auth().useDeviceLanguage();
        console.log('devlang')
    }

    async isLoggedIn() {
        await this.autoLogin();
        return this.firebaseService.isLoggedIn();
    }

    storeCredentials(email: string, passwordHash: string) {
        this.storageService.set(AuthService.KEY_EMAIL, email);
        this.storageService.set(AuthService.KEY_PASSWORD_HASH, passwordHash);
    }

    getPasswordHash() {
        return this.storageService.get(AuthService.KEY_PASSWORD_HASH) || 'default';
    }

    getEmail() {
        return this.storageService.get(AuthService.KEY_EMAIL);
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

    async sendPasswordResetEmail(email: string) {
        await this.firebaseService.auth().sendPasswordResetEmail(email);
        this.clearCredentialsCache();
    }

    async confirmPasswordReset(actionCode: string, newPassword: string) {
        return this.firebaseService.auth().confirmPasswordReset(actionCode, this.cryptoService.hash(newPassword));
    }

    async login(email: string, password: string) {
        const passwordHash = this.cryptoService.hash(password);
        const result = await this.firebaseService.auth().signInWithEmailAndPassword(email, passwordHash);

        console.log('result', result);

        this.userContext = { userId: result.user.uid, email: email };
        this.storeCredentials(email, passwordHash);

        if (this.isVerified()) {
            st.route = {
                path: ConsumerOrderListPage.ROUTE
            };
        }
    }

    isVerified(): boolean {
        return this.firebaseService.auth().currentUser.emailVerified;
    }

    async logout() {

        await this.firebaseService.logout();
        this.preferenceService.setProfile('consumer');
        this.clearCredentialsCache();

        window.location.href = window.location.href.split('/')[0];
    }

    clearCredentialsCache() {
        this.storeCredentials('', '');
    }

    async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
        const passwordHash = this.cryptoService.hash(password);
        const result = await this.firebaseService.auth().createUserWithEmailAndPassword(email, passwordHash);
        this.userContext = { userId: result.user.uid, email: email };
        this.storeCredentials(email, passwordHash);
        this.sendEmailVerification();
        return result;
    }

    async deleteUser() {
        await this.firebaseService.auth().currentUser.delete();
    }

    async getIdToken() {
        return this.firebaseService.auth().currentUser.getIdToken();
    }
}

// quick & dirty hack because DI has a bug
window.authService = st.inject(AuthService);

declare global {
    interface Window {
        authService: AuthService;
    }
}