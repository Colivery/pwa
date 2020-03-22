import {inject, injectable} from "springtype/core/di";
import {tsx} from "springtype/web/vdom";
import {AuthService} from "../service/auth";
import {IRouteMatch} from "springtype/web/router/interface/iroute-match";
import {IRouterGuardResponse} from "springtype/web/router/interface/irouter-guard-response";
import {RegisterUserAddressPage} from "../page/register/register-user-address/register-user-address";
import {LoginPage} from "../page/login/login";

@injectable
export class RegisterGuard {

    @inject(AuthService)
    private authService: AuthService;

    register = async (match: IRouteMatch): Promise<IRouterGuardResponse> => {
        if (await this.authService.isLoggedIn()) {
            return RegisterUserAddressPage.ROUTE
        }
        return true;
    };
    registerComplete = async (match: IRouteMatch): Promise<IRouterGuardResponse> => {
        if (!await this.authService.isLoggedIn()) {
            return LoginPage.ROUTE;
        }
        return true;
    };

}

