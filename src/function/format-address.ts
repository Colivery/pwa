import { IUserProfileResponse } from "../datamodel/user";

export const formatAddress = (user: Partial<IUserProfileResponse>): string => {
    return `${user.street} ${user.streetNo} ${user.zipCode} ${user.city}`;
}