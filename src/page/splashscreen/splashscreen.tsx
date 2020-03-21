import { st } from "springtype/core";
import { inject } from "springtype/core/di";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import { AuthService } from "../../service/auth";
import tpl from "./splashscreen.tpl";
import "./splashscreen.scss";
import { Form } from "springtype/web/form";

@component({
    tpl
})
export class SplashscreenPage extends st.component implements ILifecycle {

    static ROUTE = "splashscreen";

    @inject(AuthService)
    authService: AuthService;

    constructor() {
        super();

        this.authService.autoLogin();
    }
}
