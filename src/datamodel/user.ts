import { GPSLocation } from "./gps-location";

export interface IUserProfile {
    location: GPSLocation,
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
    city: string;
    street: string;
    streetNo: string;
    zipCode: string;
}

export interface IUserProfileRequest extends IUserProfile {
}

export interface IUserProfileResponse extends IUserProfile {
    id: string;
    createdAt: string;
    updatedAt: string;
    firebaseUid: string;
}
