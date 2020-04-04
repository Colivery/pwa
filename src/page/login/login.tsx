import "./login.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./login.tpl";
import { Form } from "springtype/web/form";
import { RegisterPage } from "../register/register-account/register";

@component({
    tpl
})
export class LoginPage extends st.component implements ILifecycle {

    static ROUTE = "login";

    @ref
    formRef: Form;

    @ref
    errorMessage: ErrorMessage;

    class = ['wrapper', 'valign-wrapper'];

    onLoginClick = async () => {

        this.doLogin();
    };

    doLogin = async () => {

        try {
            if (await this.formRef.validate()) {

                const data = this.formRef.getState() as { email: string, password: string };
                await window.authService.login(data.email, data.password);
            }
        } catch (e) {
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

        if (event.key === "Enter") {
            setTimeout(() => {
                this.doLogin();
            }, 100)
        }
    }
}
