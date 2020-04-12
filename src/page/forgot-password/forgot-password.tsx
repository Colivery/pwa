import "./forgot-password.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./forgot-password.tpl";
import { MatForm, MatLoaderCircle } from "st-materialize";
import { LoginPage } from "../login/login";
import { Center } from "../../component/center/center";

interface IForgotPasswordFormState {
    email: string;
}

@component({
    tpl
})
export class ForgotPasswordPage extends st.component implements ILifecycle {

    static ROUTE = "forgot-password";

    @ref
    form: MatForm;

    @ref
    errorMessage: ErrorMessage;

    @ref
    errorMessageContainer: HTMLElement;

    @ref
    matLoaderCircleRef: MatLoaderCircle;

    @ref
    emailRow: HTMLElement;

    @ref
    backButtonContainerRef: Center;

    /*
    @ref
    codeRow: HTMLElement;

    @ref
    codeNextButtonRef: HTMLElement;
    */

    @ref
    emailNextButtonRef: HTMLElement;

    @ref
    resetEmailSentMessageRef: HTMLElement;

    class = ['wrapper', 'valign-wrapper'];

    onAfterRender() {
        st.hide(this.errorMessageContainer);
    }

    async onRouteEnter() {

        await this.initiallyRendered();

        this.errorMessage.setMessage('');
        st.hide(this.errorMessageContainer);
        this.emailNextButtonRef.classList.remove('hide');
        this.backButtonContainerRef.el.classList.add('hide');
        this.emailNextButtonRef.classList.remove('disabled');
        this.emailRow.classList.remove('hide');
    }

    onNextClick = async () => {

        if (await this.form.validate()) {

            this.emailNextButtonRef.classList.add('disabled');

            const formData = this.form.getState() as IForgotPasswordFormState;

            this.matLoaderCircleRef.setVisible(true);

            try {
                await window.authService.sendPasswordResetEmail(formData.email);
                this.resetEmailSentMessageRef.classList.remove('hide');

                setTimeout(() => {
                    st.route = {
                        path: LoginPage.ROUTE
                    };
                }, 3000);

            } catch (e) {
                this.errorMessage.setMessage(e.message);
                st.show(this.errorMessageContainer);
                this.emailNextButtonRef.classList.add('hide');
                this.backButtonContainerRef.el.classList.remove('hide');

            } finally {
                this.matLoaderCircleRef.setVisible(false);

                this.emailNextButtonRef.classList.add('hide');
                this.emailRow.classList.add('hide');
            }
        }
    }
}
