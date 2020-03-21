import {LoginPage} from "./login";
import {tsx} from "springtype/web/vdom";
import {ErrorMessage} from "../../component/error-message/error-message";
import {MatInput} from "../../component/mat/mat-input";
import {email, minLength, required} from "springtype/core/validate";
import {Form} from "springtype/web/form";

export default (component: LoginPage) => (
    <fragment>
        <div class="row">
            <Form ref={{ formRef: component }}class="col s12">
                <div class="row">
                    <MatInput name="email" label="Email" class={['col', 's6']}
                              helperText="Enter your email "
                              validators={[required, email]}
                              successMessage={'right'}
                              errorMessage={{
                                  required: 'This field is required',
                                  'email': 'Not an valid email address'
                              }}>
                    </MatInput>
                    <MatInput name="password" label="Password" type="password" class={['col', 's6']}
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
                    <ErrorMessage ref={{errorMessage: component}}/>
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn" onClick={component.onLoginClick}>Login</a>
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn" onClick={component.onRegisterClick}>Register</a>
                </div>
                <div class="row">
                    <a href="javascript:" class="login-forgot-password" onClick={component.onForgotPassword}>I forgot my
                        password</a>
                </div>
            </Form>
        </div>

    </fragment>
)