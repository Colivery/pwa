import { LoginPage } from "./login";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";

export default (component: LoginPage) => (
    <fragment>

        <div class="row">
            <form class="col s12">
                <div class="row">
                    <div class="input-field col s6">
                        <input ref={{ email: component }} name="email" type="email" placeholder="E-Mail" required class="validate" />
                        <label for="first_name">E-Mail</label>
                    </div>
                    <div class="input-field col s6">
                        <input ref={{ password: component }} onkeyup={component.onPasswordFieldKeyUp} name="password" type="password" placeholder="Password" required class="validate" />
                        <label for="last_name">Password</label>
                    </div>
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }} />
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn" onClick={component.onLoginClick}>Login</a>
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn" onClick={component.onRegisterClick}>Register</a>
                </div>
                <div class="row">
                    <a href="javascript:" class="login-forgot-password" onClick={component.onForgotPassword}>I forgot my password</a>
                </div>
            </form>
        </div>

    </fragment >
)