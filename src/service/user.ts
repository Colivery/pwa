import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { IUserProfileRequest, IUserProfileResponse } from "../datamodel/user";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";
import { StorageService } from "./storage";

export interface UserData {
    first_name: string;
    phone: string;
    last_name: string;
    address: string;
    geo_location: {
        latitude: number;
        longitude: number;
    }
}

@injectable
export class UserService {

    static readonly LOCAL_USER_DATA_IDENT = 'local_user_data';

    userProfile;

    @inject(StorageService)
    storageService: StorageService;

    async getUserProfile(): Promise<IUserProfileResponse | undefined> {

        if (this.userProfile) {
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
            st.error('error in get user profile request', e)
        }
    }

    async upsertUserProfile(userProfileData: IUserProfileRequest): Promise<void> {

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
            st.error('error in get user profile request', e)
        }
    }
}