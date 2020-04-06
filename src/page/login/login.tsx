import "./login.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./login.tpl";
import { Form } from "st-materialize";
import { RegisterPage } from "../register/register-account/register";

@component({
    tpl
})
export class LoginPage extends st.component implements ILifecycle {

    static ROUTE = "login";

    @ref
    form: Form;

    @ref
    errorMessage: ErrorMessage;

    class = ['wrapper', 'valign-wrapper'];

    onLoginClick = async () => {

        this.doLogin();
    };

    doLogin = async () => {

        try {
            if (await this.form.validate(true)) {

                console.log('valid');

                const data = this.form.getState() as { email: string, password: string };
                await window.authService.login(data.email, data.password);
            } else {
                console.log('fu ck', await this.form.validate(true));
            }
        } catch (e) {
            console.log('not valid', e);

            this.errorMessage.message = e.message;
        }
    }

    onRegisterClick = async () => {
        st.route = {
            path: RegisterPage.ROUTE
        };
    };

    onForgotPassword = () => {
        st.warn('onForgotPassword')
    };

    onPasswordFieldKeyUp = (event: KeyboardEvent) => {

        console.log('onKeyDown!!', event)

        if (event.key === "Enter") {
            setTimeout(() => {
                console.log('akljdalsLOGIN')
                this.doLogin();
            }, 100)
        }
    }
}
