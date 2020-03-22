import * as firebase from "firebase";
import {inject, injectable} from "springtype/core/di";
import {FirebaseService} from "./firebase";
import {IUserProfile} from "../datamodel/user";
import {FIREBASE_CONFIG} from "../config/firebase";
import {st} from "springtype/core";
import {IRegisterFormState} from "../page/register/register-account/register.tpl";

const GeoPoint = firebase.firestore.GeoPoint;

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

    async createUserProfileComplete(userProfileComplete: UserProfileComplete) {
        st.debug('createUserProfile', userProfileComplete);
        await this.getUserCollection().update(userProfileComplete)
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

    getGeoPoint(lat: string, lng: string) {
        return new GeoPoint(parseFloat(lat), parseFloat(lng));
    }

    getUserId() {
        return this.firebaseService.getLoggedInUserId();
    }
}

export interface UserProfileComplete {
    name: string;
    address: string;
    phone: string;
    accepted_support_inquiry: boolean;
    geo_location: any;
}