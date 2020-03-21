import { Sheets } from "./sheet";

export const getUserRef = (userId: string) => {
    return `users/${userId}`
};

export interface User {
    id: string;
    email: string;
}