import {injectable} from "springtype/core/di";
import {st} from "springtype/core";
import {IUserProfileRequest, IUserProfileResponse} from "../datamodel/user";
import {request} from "../function/http";

const ENDPOINT_URL = 'https://colivery-api.s0ra.de';

@injectable
export class UserService {

    async getUserProfile(): Promise<IUserProfileResponse | undefined> {
        try {
            st.debug('getUserProfile');

            return JSON.parse(await request(
                'GET',
                `${ENDPOINT_URL}/user`,
                {
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            ));
        } catch (e) {
            st.error('error in get user profile request', e)
        }
    }

    async upsertUserProfile(userProfile: IUserProfileRequest): Promise<void> {

        st.debug('upsertUserProfile...', userProfile);
        try {
            await request(
                'POST',
                `${ENDPOINT_URL}/user`,
                {
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                JSON.stringify(userProfile)
            )
        } catch (e) {
            st.error('error in get user profile request', e)
        }
    }
}