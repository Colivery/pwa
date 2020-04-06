import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { UserProfile, IUserProfileResponse } from "../datamodel/user";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";
import { StorageService } from "./storage";
import { ErrorService } from "./error";

@injectable
export class UserService {

    static readonly LOCAL_USER_DATA_IDENT = 'local_user_data';

    userProfile;

    @inject(StorageService)
    storageService: StorageService;

    @inject(ErrorService)
    errorService: ErrorService;

    async deleteOwnUser(): Promise<void> {

        try {
            await fetch(`${SERVICE_API_ENDPOINT}/user/own`, {
                method: 'DELETE',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer', // no-referrer, *client
            });

        } catch (e) {
            st.error('error in deleting user profile', e);
            this.errorService.show();
        }
    }

    async getUserProfile(useCache: boolean = true): Promise<IUserProfileResponse> {

        //this.errorService.show();

        if (this.userProfile && useCache) {
            return this.userProfile;
        }

        try {
            const response = await fetch(`${SERVICE_API_ENDPOINT}/user`, {
                method: 'GET',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer', // no-referrer, *client
            });
            this.userProfile = response.json();
            return this.userProfile;

        } catch (e) {
            st.error('error in get user profile request', e);
            this.errorService.show();
        }
    }

    async upsertUserProfile(userProfileData: UserProfile): Promise<void> {

        this.userProfile = {
            ...this.userProfile,
            ...userProfileData
        }

        try {

            await fetch(`${SERVICE_API_ENDPOINT}/user`, {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(userProfileData) // body data type must match "Content-Type" header
            });

        } catch (e) {
            st.error('error in get user profile request', e);
            this.errorService.show();
        }
    }
}