import "./forgot-password.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./forgot-password.tpl";
import { MatForm, MatLoaderCircle } from "st-materialize";
import { LoginPage } from "../login/login";

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
        st.dom.hide(this.errorMessageContainer);
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
                // TODO: show error message
            } finally {
                this.matLoaderCircleRef.setVisible(false);

                this.emailNextButtonRef.classList.add('hide');
                this.emailRow.classList.add('hide');
            }
        }
    }
}
