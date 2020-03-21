import {st} from "springtype/core";

export interface IRegisterContext {

    // first step
    user_id: string;
    email: string;
    accepted_privacy_policy: boolean;
    accepted_terms_of_use: boolean;

    // second step
    name: string;
    address: string;
    phone: string;
    geo_location: Array<string>
    accepted_support_inquiry: boolean;


}

export const INITIAL_REGISTER_CONTEXT_STATE: IRegisterContext = {
    // first sept
    user_id: null,
    email: null,
    accepted_privacy_policy: false,
    accepted_terms_of_use: false,

    // second step
    name: null,
    address: null,
    phone: null,
    geo_location: [],
    accepted_support_inquiry: false
};

export const REGISTER_CONTEXT = 'register';

export const getRegisterContext = () => {
    return st.context(REGISTER_CONTEXT, INITIAL_REGISTER_CONTEXT_STATE);
};