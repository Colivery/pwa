import { GPSLocation } from "./gps-location";

export interface UserProfile {
    user_id?: string;
    geo_location: GPSLocation,
    phone: string;
    email?: string;
    first_name: string;
    last_name: string;
    address: string;
}

export interface IUserProfileResponse extends UserProfile {
}
