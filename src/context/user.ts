import {st} from "springtype/core";

export interface IUserContext {
    userId: string;
    email: string;
}

export const INITIAL_USER_CONTEXT_STATE: IUserContext = {
    userId: null,
    email: null,
};

export const USER_CONTEXT = 'user';

export const getUserContext = () => {
    return st.context(USER_CONTEXT, INITIAL_USER_CONTEXT_STATE);
};