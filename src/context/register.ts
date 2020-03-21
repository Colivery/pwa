import {st} from "springtype/core";

export interface IRegisterContext {

    // first step
    email: string;
    password: string,
    acceptedTermOfUse: boolean;
    acceptedPrivacyPolicy: boolean;

    // second step
    username: string;
    address: string,
    acceptedPoneCalls: boolean;


}

export const INITIAL_REGISTER_CONTEXT_STATE: IRegisterContext = {
    // first sept
    email: null,
    password: null,
    acceptedTermOfUse: false,
    acceptedPrivacyPolicy: false,

    // second step
    username: null,
    address: null,
    acceptedPoneCalls: false
};

export const REGISTER_CONTEXT = 'register';

export const getRegisterContext = () => {
    return st.context(REGISTER_CONTEXT, INITIAL_REGISTER_CONTEXT_STATE);
};