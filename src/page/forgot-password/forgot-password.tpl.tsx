import { ForgotPasswordPage } from "./forgot-password";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput, MatForm, MatLoaderCircle } from "st-materialize";
import { email, required, minLength } from "springtype/core/validate";
import { LogoRow } from "../../component/logo-row/logo-row";
import { st } from "springtype/core";
import { Center } from "../../component/center/center";
import { T } from "springtype/web/i18n/t";

export default (component: ForgotPasswordPage) => (
    <fragment>
        <div class="container">
            <LogoRow />

            <h3 class="slogan">
                {st.t("Forgot Password")}
            </h3>

            <MatForm ref={{ form: component }}>
                <div class="row" ref={{ emailRow: component }}>
                    <MatInput name="email" label={st.t("E-mail")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Your e-mail address")}
                        validators={[required, email]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'email': st.t("Not a valid e-mail address")
                        }}>
                    </MatInput>
                    {/*
                    <MatInput name="resetCode" label={st.t("Reset code")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Reset code")}
                        onKeyDown={component.onPasswordFieldKeyUp}
                        validators={[required, minLength(7)]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Passwords consist of atleast 7 characters")
                        }}>
                    </MatInput>
                    */}
                </div>
                <div class="row">
                    <MatLoaderCircle ref={{ matLoaderCircleRef: component }} class="hide" />

                    <p class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3', 'hide']} ref={{ resetEmailSentMessageRef: component }}>
                        <Center>
                            {st.t('We have sent you an email. Please check your inbox.')}
                        </Center>
                    </p>
                </div>
                {/*
                <div class="row hide" ref={{ codeRow: component }}>

                    <p>Wir haben Dir eine E-Mail gesendet. Bitte klicke auf den </p>

                    <MatInput name="resetCode" label={st.t("Reset code")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Reset code")}
                        validators={[required, minLength(7)]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Code must consist of at least 7 characters")
                        }}>
                    </MatInput>
                </div>
                 */}
                <div class="row" ref={{ errorMessageContainer: component }}>
                    <Center class={['col', 's12']}>
                        <ErrorMessage ref={{ errorMessage: component }} />
                    </Center>
                </div>
                <div class="row">
                    <Center class={['col', 's12']}>

                        <a class={['waves-effect', 'waves-light', 'btn', 'login-button', 'mat-align-middle']}
                            ref={{ emailNextButtonRef: component }}
                            onClick={component.onNextClick}>{st.t("Next")}</a>

                        {/*
                        <a class={['waves-effect', 'waves-light', 'btn', 'login-button', 'mat-align-middle']}
                            ref={{ codeNextButtonRef: component }}
                            onClick={component.onCodeNextClick}>{st.t("Next")}</a>
                        */}
                    </Center>
                    <Center ref={{ backButtonContainerRef: component }} class={['col', 's12', 'hide']}>

                        <a class={['waves-effect', 'waves-light', 'btn', 'login-button', 'mat-align-middle']}
                            onClick={() => window.history.back()}>{st.t("Back")}</a>
                    </Center>
                </div>
            </MatForm>
        </div>
    </fragment>
);