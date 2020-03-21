import {st} from "springtype/core";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./splashscreen.tpl";
import "./splashscreen.scss";
import {ConsumerOrderListPage} from "../consumer-order-list/consumer-order-list";
import {LoginPage} from "../login/login";

@component({
    tpl
})
export class SplashscreenPage extends st.component implements ILifecycle {
    constructor() {
        super();
        this.route();
    }

    async route() {
        if (await window.authService.autoLogin()) {
            st.route = {
                path: ConsumerOrderListPage.ROUTE
            };
        } else {
            st.route = {
                path: LoginPage.ROUTE
            };
        }
    }
}
