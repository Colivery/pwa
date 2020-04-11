import { LoginPage } from "./login";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput, MatForm } from "st-materialize";
import { email, minLength, required } from "springtype/core/validate";
import { LogoRow } from "../../component/logo-row/logo-row";
import { st } from "springtype/core";
import { Center } from "../../component/center/center";
import { T } from "springtype/web/i18n/t";

export default (component: LoginPage) => (
    <fragment>
        <div class="container">
            <LogoRow />

            <T tag="h3" class="slogan">Co-operated delivery!</T>

            <MatForm ref={{ form: component }}>
                <div class="row">
                    <MatInput name="email" label={st.t("E-mail")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Your e-mail address")}
                        validators={[required, email]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'email': st.t("Not a valid e-mail address")
                        }}>
                    </MatInput>
                    <MatInput name="password" label={st.t("Password")} type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Your password")}
                        onKeyDown={component.onPasswordFieldKeyUp}
                        validators={[required, minLength(7)]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Your password must consist of at least 7 characters")
                        }}>
                    </MatInput>
                </div>
                <div class="row" ref={{ errorMessageContainer: component }}>
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />
                </div>
                <div class="row" ref={{ loginButtonContainer: component }}>
                    <Center class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}>
                        <a ref={{ loginButton: component }} class={['waves-effect', 'waves-light', 'btn', 'login-button', 'mat-align-middle']}
                            onClick={component.onLoginClick}><i class="material-icons">meeting_room</i> {st.t("Login")}</a>

                        <br />
                        <br />
                        <br />

                        <a href="javascript:" class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                            onClick={component.onForgotPasswordLinkClick}>{st.t("I forgot my password")}</a>
                    </Center>
                </div>



                <div class="row">

                    <div class="col s12 m6 offset-m3 l6 offset-l3">
                        <hr />
                        <br />
                        <Center>
                            Ich habe noch keinen Account und möchte mich gerne registrieren:
                        </Center>
                        <br />
                        <div class="row center-align">
                            <Center class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}>
                                <a class={['waves-effect', 'waves-light', 'btn', 'mat-align-middle']}
                                    onClick={component.onRegisterClick}><i class="material-icons">create</i> {st.t("Sign up")}</a>
                            </Center>
                        </div>
                    </div>
                </div>
            </MatForm>
        </div>
    </fragment >
);