import "./login.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./login.tpl";
import { MatForm } from "st-materialize";
import { RegisterPage } from "../register/register-account/register";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";

@component({
    tpl
})
export class LoginPage extends st.component implements ILifecycle {

    static ROUTE = "login";

    @ref
    form: MatForm;

    @ref
    errorMessage: ErrorMessage;

    @ref
    errorMessageContainer: HTMLElement;

    @ref
    loginButton: HTMLElement;

    class = ['wrapper', 'valign-wrapper'];

    onLoginClick = async () => {
        this.doLogin();
    };

    onAfterRender() {
        st.dom.hide(this.errorMessageContainer);
    }

    doLogin = async () => {

        st.dom.hide(this.errorMessageContainer);

        try {
            if (await this.form.validate(true)) {
                this.loginButton.classList.add('disabled');
                const data = this.form.getState() as { email: string, password: string };
                await window.authService.login(data.email, data.password);
            }
        } catch (e) {

            this.loginButton.classList.remove('disabled');
            st.dom.show(this.errorMessageContainer);

            this.renderPartial(e.message, this.errorMessage.el);
        }
    }

    onRegisterClick = async () => {
        st.route = {
            path: RegisterPage.ROUTE
        };
    };

    onForgotPasswordLinkClick = () => {
        st.route = {
            path: ForgotPasswordPage.ROUTE
        };
    };

    onPasswordFieldKeyUp = (event: KeyboardEvent) => {

        if (event.key === "Enter") {
            setTimeout(() => {
                this.doLogin();
            }, 100)
        }
    }
}
