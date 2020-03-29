import {injectable} from "springtype/core/di";
import {st} from "springtype/core";
import {IUserProfileRequest, IUserProfileResponse} from "../datamodel/user";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";

@injectable
export class UserService {

    async getUserProfile(): Promise<IUserProfileResponse | undefined> {
        try {
            st.debug('getUserProfile');

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
            return response.json();

        } catch (e) {
            st.error('error in get user profile request', e)
        }
    }

    async upsertUserProfile(userProfile: IUserProfileRequest): Promise<void> {

        st.debug('upsertUserProfile...', userProfile);
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
                body: JSON.stringify(userProfile) // body data type must match "Content-Type" header
            });

        } catch (e) {
            st.error('error in get user profile request', e)
        }
    }
}