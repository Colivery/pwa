import {st} from "springtype/core";

export interface IOrderContext {
    id?: string;
}

export const INITIAL_ORDER_CONTEXT_STATE: IOrderContext = {
   id: null
};

export const ORDER_CONTEXT = 'order';

export const getOrderContext = () => {
    return st.context(ORDER_CONTEXT, INITIAL_ORDER_CONTEXT_STATE);
};