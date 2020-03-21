import { st } from "springtype/core";
import { inject } from "springtype/core/di";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import { IonicJSX } from "st-ionic";
import { AuthService } from "../../service/auth";
import tpl from "./login.tpl";
import "./login.scss";

@component({
  tpl
})
export class LoginPage extends st.component implements ILifecycle {
  
  static ROUTE = "login";

  @inject(AuthService)
  authService: AuthService;

  @ref
  email: IonicJSX.IonInput;

  @ref
  password: IonicJSX.IonInput;

  @ref
  errorMessage: ErrorMessage;

  onLoginClick = async () => {

    try {
      await this.authService.login(this.email.value, this.password.value);

      console.log('login accomplished')

    } catch (e) {
      this.errorMessage.message = e.message;
    }
  };

  onRegisterClick = async () => {

    try {
      await this.authService.register(this.email.value, this.password.value);

      console.log('register accomplished')

    } catch (e) {
      this.errorMessage.message = e.message;
    }
  };

  onPasswordFieldKeyUp = (evt: KeyboardEvent) => {
    if (evt.keyCode === 13) {
      this.onLoginClick();
    }
  };

  onAfterInitialRender() {
    this.authService.autoLogin();
  }

  onForgotPassword = () => {
    console.log('onForgotPassword')
  };
}
