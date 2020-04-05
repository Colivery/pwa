import { LoginPage } from "./login";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput } from "st-materialize";
import { email, minLength, required } from "springtype/core/validate";
import { Form } from "springtype/web/form";
import { LogoRow } from "../../component/logo-row/logo-row";
import { st } from "springtype/core";

export default (component: LoginPage) => (
    <fragment>
        <div class="container">
            <LogoRow />

            <h3 class="slogan">
                {st.t("Together better supplied!")}
            </h3>

            <Form ref={{ formRef: component }}>
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
                            'min-length': st.t("Passwords consist of atleast 7 characters")
                        }}>
                    </MatInput>
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />
                </div>
                <div class="row" ref={{ loginButtonContainer: component }}>
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3', 'login-button']}
                        onClick={component.onLoginClick}>{st.t("Login")}</a>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        onClick={component.onRegisterClick}>{st.t("Sign up")}</a>
                </div>

                {/* 
                <div class="row center-align">
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <a href="javascript:" class="login-forgot-password" onClick={component.onForgotPassword}>
                            {st.t("I forgot my password")}
                        </a>
                    </div>
                </div>*/}
            </Form>
        </div>
    </fragment>
);