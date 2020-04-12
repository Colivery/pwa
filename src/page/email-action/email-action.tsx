import "./email-action.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import tpl from "./email-action.tpl";
import { MatLoaderCircle } from "st-materialize";
import { LoginPage } from "../login/login";
import { FirebaseService } from "../../service/firebase";
import { inject } from "springtype/core/di";
import { ResetPasswordPage } from "../reset-password/reset-password";

// https://firebase.google.com/docs/auth/custom-email-handler
@component({
    tpl
})
export class EmailActionPage extends st.component implements ILifecycle {

    static ROUTE = "email-action";

    @ref
    headerRef: HTMLElement;

    @inject(FirebaseService)
    firebaseService: FirebaseService;

    @ref
    errorMessageRef: ErrorMessage;

    @ref
    matLoaderCircleRef: MatLoaderCircle;

    class = ['wrapper', 'valign-wrapper'];

    getQueryParams() {

        const urlParams = new URLSearchParams(window.location.href.split('?')[1]);

        return {
            mode: urlParams.get('mode'),
            oobCode: urlParams.get('oobCode')
        }
    }

    onRouteEnter() {

        switch (this.getQueryParams().mode) {
            case "resetPassword":
                this.doResetPasswordFlow();
                break;
            case "verifyEmail":
                this.doVerifyEmailFlow();
                break;
        }
    }

    async doResetPasswordFlow() {

        this.renderPartial(st.t('Forgot Password'), this.headerRef);

        try {
            
            const email = await window.authService.firebaseService.auth().verifyPasswordResetCode(this.getQueryParams().oobCode);

            this.errorMessageRef.el.style.color = '#000';
            this.errorMessageRef.setMessage(st.t("Resetting password..."));

            setTimeout(() => {
                st.route = {
                    path: ResetPasswordPage.ROUTE,
                    params: {
                        email,
                        actionCode: this.getQueryParams().oobCode
                    }
                };
            }, 3000);

        } catch (e) {

            this.errorMessageRef.setMessage(st.t('An error occurred while trying to verify your email address. Redirecting to login page...'));

            setTimeout(() => {
                st.route = {
                    path: LoginPage.ROUTE
                };
            }, 3000);

        } finally {
            this.matLoaderCircleRef.setVisible(false);
        }


    }

    async doVerifyEmailFlow() {

        this.renderPartial(st.t('Account confirmation'), this.headerRef);

        try {
            
            await window.authService.firebaseService.auth().applyActionCode(this.getQueryParams().oobCode);

            this.errorMessageRef.el.style.color = '#000';
            this.errorMessageRef.setMessage(st.t("We've activated your account and logging you in now..."));

            setTimeout(() => {
                st.route = {
                    path: LoginPage.ROUTE
                };
            }, 3000);

        } catch (e) {

            this.errorMessageRef.setMessage(st.t('An error occurred while trying to verify your email address. Redirecting to login page...'));

            setTimeout(() => {
                st.route = {
                    path: LoginPage.ROUTE
                };
            }, 3000);

        } finally {
            this.matLoaderCircleRef.setVisible(false);
        }
    }
}
