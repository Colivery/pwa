import { LoginPage } from "./login";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput } from "../../component/mat/mat-input";
import { email, minLength, required } from "springtype/core/validate";
import { Form } from "springtype/web/form";
import { LogoRow } from "../../component/logo-row/logo-row";

export default (component: LoginPage) => (
    <fragment>
        <div class="container">
            <LogoRow />
            <Form ref={{ formRef: component }}>
                <div class="row">
                    <MatInput name="email" label="E-Mail"
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        helperText="Deine E-Mail-Adresse"
                        validators={[required, email]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld',
                            'email': 'Keine gültige E-Mail'
                        }}>
                    </MatInput>
                    <MatInput name="password" label="Passwort" type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        helperText="Dein Passwort"
                        validators={[required, minLength(7)]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld',
                            'min-length': 'Bitte mindestens 7 Zeichen'
                        }}>
                    </MatInput>
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        onClick={component.onLoginClick}>Einloggen</a>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        onClick={component.onRegisterClick}>Registrieren</a>
                </div>

                {/* 
                <div class="row center-align">
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <a href="javascript:" class="login-forgot-password" onClick={component.onForgotPassword}>
                            Ich habe mein Passwort vergessen
                        </a>
                    </div>
                </div>*/}
            </Form>
        </div>
    </fragment>
);