import "firebase/auth";
import {inject, injectable} from "springtype/core/di";
import {FirebaseService} from "./firebase";
import {IUserProfile} from "../datamodel/user";
import {FIREBASE_CONFIG} from "../config/firebase";
import {st} from "springtype/core";
import {IRegisterUserAddressFormState} from "../page/register/register-user-address/register-user-address.tpl";
import {IRegisterFormState} from "../page/register/register-account/register.tpl";

@injectable
export class RegisterService {

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService;

    async createUserProfile(userProfile: IRegisterFormState) {
        st.debug('createUserProfile', userProfile);
        await this.getUserCollection().set({
            email: userProfile.email,
            accepted_privacy_policy: userProfile.accepted_privacy_policy,
            accepted_terms_of_use: userProfile.accepted_terms_of_use
        })
    }

    async createUserProfileComplete(userAddressFrom: IRegisterUserAddressFormState) {
        st.debug('createUserProfile', userAddressFrom);
        await this.getUserCollection().update(userAddressFrom)
    }

    async updateProfile(userProfile: IUserProfile) {
        st.debug('updateProfile', userProfile);
        await this.getUserCollection().update({
            ...userProfile
        })
    }
    async getUserProfile(): Promise<IUserProfile | undefined> {
        const document = await this.getUserCollection().get();
        if (document.exists) {
            return document.data() as IUserProfile;
        }
    }

    async isUserProfileCompleted() {
        const data = await this.getUserProfile();
        return data && data['name'];
    }

    private getUserCollection() {
        return this.firebaseService.firestore().collection('user').doc(this.getUserId());
    }

    getUserId() {
        return this.firebaseService.getLoggedInUserId();
    }
}