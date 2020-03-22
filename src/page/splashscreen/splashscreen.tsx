import {st} from "springtype/core";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./splashscreen.tpl";
import "./splashscreen.scss";
import {LoginPage} from "../login/login";
import {inject} from "springtype/core/di";
import {PreferenceService} from "../../service/preference";

@component({
    tpl
})
export class SplashscreenPage extends st.component implements ILifecycle {

    static ROUTE = "splashscreen";

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    constructor() {
        super();
        this.route();
    }

    async route() {
        if (await window.authService.autoLogin()) {
            st.route = {
                path: this.preferenceService.getProfile() + '-order-list'
            }

        } else {
            st.route = {
                path: LoginPage.ROUTE
            };
        }
    }
}
