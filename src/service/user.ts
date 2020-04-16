import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { IUserProfileResponse, IUserProfileRequest } from "../datamodel/user";
import { SERVICE_API_ENDPOINT, SERVICE_API_ENDPOINT_VERSION } from "../config/endpoints";
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
            const response = await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/user`, {
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

            if (response.status >= 400) {
                throw (response);
            }

        } catch (e) {
            st.error('error in deleting user profile', e);
            this.errorService.show();
        }
        //await window.authService.deleteUser();
        await window.authService.logout();
    }

    async getUserProfile(useCache: boolean = true): Promise<IUserProfileResponse> {

        //this.errorService.show();

        if (this.userProfile && useCache) {
            return this.userProfile;
        }

        try {

            const response = await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/user`, {
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

            if (response.status >= 400) {
                throw (response);
            }

            this.userProfile = response.json();
            return this.userProfile;

        } catch (e) {
            st.error('error in get user profile request', e);
            this.errorService.show();
        }
    }

    async createUserProfile(userProfileData: IUserProfileRequest): Promise<IUserProfileResponse> {

        this.userProfile = {
            ...this.userProfile,
            ...userProfileData
        }

        try {

            const response = await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/user`, {
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

            if (response.status >= 400) {
                throw (response);
            }
            return response.json();

        } catch (e) {
            st.error('error in get user profile request', e);
            this.errorService.show();
        }
    }

    async updateUserProfile(userProfileData: Partial<IUserProfileRequest>): Promise<IUserProfileResponse> {

        this.userProfile = {
            ...this.userProfile,
            ...userProfileData
        }

        try {

            const response = await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/user`, {
                method: 'PUT',
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

            if (response.status >= 400) {
                throw (response);
            }
            return response.json();

        } catch (e) {
            st.error('error in get user profile request', e);
            this.errorService.show();
        }
    }
}