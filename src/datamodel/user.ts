import {Location} from "./location";

export interface IUserProfileRequest {
    geo_location: Location,
    phone: string;
    first_name: string;
    last_name: string;
    address: string
}

export interface IUserProfileResponse extends IUserProfileRequest {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    support_member: boolean;
}
