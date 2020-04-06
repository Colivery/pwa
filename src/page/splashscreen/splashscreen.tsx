import {st} from "springtype/core";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {LoginPage} from "../login/login";
import {inject} from "springtype/core/di";
import {PreferenceService} from "../../service/preference";
import { SplashscreenService } from "../../service/splashscreen";

@component
export class SplashscreenPage extends st.component implements ILifecycle {

    static ROUTE = "splashscreen";

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    @inject(SplashscreenService)
    splashscreenService: SplashscreenService;

    constructor() {
        super();
        this.route();
    }

    render() {
        return this.splashscreenService.render();
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
