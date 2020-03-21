import { injectable, inject } from "springtype/core/di";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { ErrorMessage } from "../component/error-message/error-message";
import { tsx } from "springtype/web/vdom";
import { st } from "springtype/core";
import { LoginPage } from "../page/login/login";
import { AuthService } from "../service/auth";

@injectable
export class LoginGuard {

  @inject(AuthService)
  authService: AuthService;

  guard = async (desiredComponent: IVirtualNode) => {

    console.log('guard', desiredComponent)
    if (this.authService.isLoggedIn()) {
      return desiredComponent;
    } else {

      await this.authService.autoLogin();

      if (this.authService.isLoggedIn()) {
        return desiredComponent;
      } else {
        return <ErrorMessage message="Please log-in." />;
      }
    }
  };
}
