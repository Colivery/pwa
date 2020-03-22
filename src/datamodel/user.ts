export interface IUserProfileRequest {
    geo_location: {
        latitude: number;
        longitude: number;
    },
    phone: string;
    name: string;
    address: string,
    accepted_privacy_policy: boolean;
    accepted_terms_of_use: boolean;
    accepted_support_inquiry: boolean;
}

export interface IUserProfileResponse extends IUserProfileRequest{
    user_id: string;
    email: string;
    support_member: boolean;
}
