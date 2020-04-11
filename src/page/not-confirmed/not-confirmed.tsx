import "./not-confirmed.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ref } from "springtype/core/ref";
import tpl from "./not-confirmed.tpl";
import { LoginPage } from "../login/login";
import { MatLoaderCircle } from "st-materialize";
import { inject } from "springtype/core/di";
import { AuthService } from "../../service/auth";
import { Center } from "../../component/center/center";
import { tsx } from "springtype/web/vdom";

@component({
    tpl
})
export class NotConfirmedPage extends st.component implements ILifecycle {

    static ROUTE = "not-confirmed";

    class = ['wrapper', 'valign-wrapper'];

    @ref
    matLoaderCircle: MatLoaderCircle;

    @ref
    resendVerificationButtonRef: HTMLElement;

    @ref
    messageRef: HTMLElement;

    @ref
    nextButtonRef: HTMLElement;

    @ref
    emailDisplayRef: HTMLElement;

    @inject(AuthService)
    authService: AuthService;

    async onAfterRender() {

        if (!(await this.authService.isLoggedIn())) {
            this.forwardToLogin();
        }

        this.renderPartial(<Center><strong>{this.authService.getEmail()}</strong></Center>, this.emailDisplayRef);

        this.renderPartial(<Center>
            {st.t("We've sent you an account confirmation email. Please check your email inbox and spam folder.")}
        </Center>, this.messageRef)
    }

    onResendVerificationClick = async () => {
        this.doResendVerificationEmail();
    };

    doResendVerificationEmail = async () => {
        await window.authService.sendEmailVerification();
        st.route = {
            path: LoginPage.ROUTE
        };
    }

    onReSendVerificationEmailClick = async () => {

        this.resendVerificationButtonRef.classList.add('hide');

        this.matLoaderCircle.setVisible(true);

        await this.authService.sendEmailVerification();

        this.renderPartial(
            st.t('Please check your email inbox again.')
            , this.messageRef);

        this.nextButtonRef.classList.remove('hide');

        this.matLoaderCircle.setVisible(false);
    }

    onNextButtonClick = () => {
        this.forwardToLogin();
    }

    forwardToLogin() {
        st.route = {
            path: LoginPage.ROUTE
        }
    }
}
