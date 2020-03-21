export interface IUserProfile {
    name: string;
    phone: string;
    address: string;
    email: string;
    geo_location: { _lat: number, _long: number }
    accepted_privacy_policy: boolean;
    accepted_support_inquiry: boolean;
    accepted_terms_of_use: boolean;
    is_support_member: boolean
}