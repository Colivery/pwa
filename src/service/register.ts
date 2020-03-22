import "firebase/auth";
import {inject, injectable} from "springtype/core/di";
import {FirebaseService} from "./firebase";
import {IUserProfile} from "../datamodel/user";
import {FIREBASE_CONFIG} from "../config/firebase";
import {st} from "springtype/core";
import {IRegisterUserAddressFormState} from "../page/register/register-user-address/register-user-address.tpl";
import {IRegisterFormState} from "../page/register/register.tpl";

@injectable
export class RegisterService {

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService;

    async createUserProfile(userId: string, userProfile: IRegisterFormState) {
        st.debug('createUserProfile', userId, userProfile);
        await this.getUserCollection(userId).set({
            email: userProfile.email,
            accepted_privacy_policy: userProfile.accepted_privacy_policy,
            accepted_terms_of_use: userProfile.accepted_terms_of_use
        })
    }

    async createUserProfileComplete(userId: string, userAddressFrom: IRegisterUserAddressFormState) {
        st.debug('createUserProfile', userId, userAddressFrom);
        await this.getUserCollection(userId).update(userAddressFrom)
    }

    async getUserProfile(userId: string): Promise<IUserProfile | undefined> {
        const document = await this.getUserCollection(userId).get();
        if (document.exists) {
            return document.data() as IUserProfile;
        }
    }

    async isUserProfileCompleted(userId: string){
        const data = await this.getUserProfile(userId);
        return data && data['name'];
    }

  private getUserCollection(userId: string) {
        return this.firebaseService.firestore().collection('user').doc(userId);
    }
}