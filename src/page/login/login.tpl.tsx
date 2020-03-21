import { LoginPage } from "./login";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput } from "../../component/mat/mat-input";
import { email, minLength, required } from "springtype/core/validate";
import { Form } from "springtype/web/form";
import { LogoRow } from "../../component/logo-row/logo-row";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";

export default (component: LoginPage) => (
    <fragment>
        <div class="container">
            <LogoRow />
            <Form ref={{ formRef: component }}>
                <div class="row">
                    <MatInput name="email" label="Email"
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        helperText="Enter your email "
                        validators={[required, email]}
                        successMessage={'right'}
                        errorMessage={{
                            required: 'This field is required',
                            'email': 'Not an valid email address'
                        }}>
                    </MatInput>
                    <MatInput name="password" label="Password" type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        helperText="Enter here your password "
                        validators={[required, minLength(7)]}
                        successMessage={'right'}
                        errorMessage={{
                            required: 'This field is required',
                            'min-length': 'Minimum password length is 7'
                        }}>
                    </MatInput>
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        onClick={component.onLoginClick}>Login</a>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        onClick={component.onRegisterClick}>Register</a>
                </div>
                <div class="row center-align">
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <a href="javascript:" class="login-forgot-password" onClick={component.onForgotPassword}>I
                            forgot my password</a>
                    </div>
                </div>
            </Form>
        </div>
    </fragment>
)