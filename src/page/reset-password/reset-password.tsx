import "./reset-password.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./reset-password.tpl";
import { MatForm, MatLoaderCircle, MatInput } from "st-materialize";
import { LoginPage } from "../login/login";

interface IResetPasswordFormState {
    newPassword: string;
    newPasswordAgain: string;
}

@component({
    tpl
})
export class ResetPasswordPage extends st.component implements ILifecycle {

    static ROUTE = "reset-password/email/:email/actionCode/:actionCode";

    @ref
    form: MatForm;

    @ref
    errorMessage: ErrorMessage;

    @ref
    errorMessageContainer: HTMLElement;

    @ref
    changePasswordButtonRef: HTMLElement;

    @ref
    matLoaderCircleRef: MatLoaderCircle;

    @ref
    newPasswordRef: MatInput;

    @ref
    newPasswordAgainRef: MatInput;

    class = ['wrapper', 'valign-wrapper'];

    onAfterRender() {
        st.hide(this.errorMessageContainer);
    }

    onNextClick = async () => {

        st.hide(this.errorMessageContainer);

        if (await this.form.validate()) {

            this.changePasswordButtonRef.classList.add('disabled');

            const formData = this.form.getState() as IResetPasswordFormState;

            const email = st.route.params.email as string;
            const actionCode = st.route.params.actionCode as string;

            this.matLoaderCircleRef.setVisible(true);

            try {
                await window.authService.confirmPasswordReset(actionCode, formData.newPassword);
                await window.authService.login(email, formData.newPassword);
            } catch (e) {

                st.show(this.errorMessageContainer);

                this.errorMessage.setMessage(e.message);

            } finally {
                this.matLoaderCircleRef.setVisible(false);
                this.changePasswordButtonRef.classList.remove('disabled');
            }
        }
    }

    onBackButtonClick = () => {
        st.route = {
            path: LoginPage.ROUTE
        }
    }
}
