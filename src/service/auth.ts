import {inject, injectable} from "springtype/core/di";
import {CryptoService} from "./crypto";
import {FirebaseService} from "./firebase";
import {FIREBASE_CONFIG} from "../config/firebase";
import {st} from "springtype/core";
import {StorageService} from "./storage";
import {ConsumerOrderListPage} from "../page/consumer-order-list/consumer-order-list";
import {LoginPage} from "../page/login/login";
import {context} from "springtype/core/context";
import {getUserContext, INITIAL_USER_CONTEXT_STATE, IUserContext, USER_CONTEXT} from "../context/user";

@injectable
export class AuthService {

    @inject(CryptoService)
    cryptoService: CryptoService;

    @inject(StorageService)
    storageService: StorageService;

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService; // leads to: new FirebaseService(FIREBASE_CONFIG)

    @context(USER_CONTEXT)
    userContext: IUserContext = getUserContext();

    constructor() {
        st.debug('AuthService created', this.cryptoService, this.storageService, this.firebaseService)
    }

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
        st.debug('auto-login');

        const email = this.getEmail();
        const passwordHash = this.getPasswordHash();

        try {
            if (email && passwordHash) {
                const result = await this.firebaseService.auth().signInWithEmailAndPassword(email, passwordHash);
                this.userContext = {userId: result.user.uid, email: email};
                st.debug('result.user.uid this.userContext', result.user.uid, this.userContext);
                return true;
            }
        } catch (e) {
            st.debug('error in login', e)
        }
        return false;
    }

    async login(email: string, password: string) {
        const passwordHash = this.cryptoService.hash(password);
        const result = await this.firebaseService.auth().signInWithEmailAndPassword(email, passwordHash);
        this.userContext = {userId: result.user.uid, email: email};
        st.debug('result.user.uid this.userContext', result.user.uid, this.userContext);
        this.storeCredentials(email, passwordHash);

        st.route = {
            path: ConsumerOrderListPage.ROUTE
        };
    }

    async logout() {
        await this.firebaseService.logout();
        this.storeCredentials('', '');
        this.userContext = INITIAL_USER_CONTEXT_STATE;
        st.route = {
            path: LoginPage.ROUTE
        };
    }

    async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
        const passwordHash = this.cryptoService.hash(password);
        const result = await this.firebaseService.auth().createUserWithEmailAndPassword(email, passwordHash);
        this.userContext = {userId: result.user.uid, email: email};
        this.storeCredentials(email, passwordHash);
        return result;
    }
}

// quick & dirty hack because DI has a bug
window.authService = new AuthService();

declare global {
    interface Window {
        authService: AuthService;
    }
}