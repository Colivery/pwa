import {Location} from "./location";

export interface IUserProfileRequest {
    geo_location: Location,
    phone: string;
    name: string;
    address: string,
    accepted_privacy_policy: boolean;
    accepted_terms_of_use: boolean;
    accepted_support_inquiry: boolean;
    is_support_member: boolean;
}

export interface IUserProfileResponse extends IUserProfileRequest {
    user_id: string;
    email: string;
    firstname: string;
    lastname: string;
    support_member: boolean;
}
