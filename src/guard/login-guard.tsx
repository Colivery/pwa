import {inject, injectable} from "springtype/core/di";
import {tsx} from "springtype/web/vdom";
import {AuthService} from "../service/auth";
import {IRouteMatch} from "springtype/web/router/interface/iroute-match";
import {IRouterGuardResponse} from "springtype/web/router/interface/irouter-guard-response";
import {ConsumerOrderListPage} from "../page/consumer-order-list/consumer-order-list";
import {st} from "springtype/core";
import {RegisterUserAddressPage} from "../page/register/register-user-address/register-user-address";
import {LoginPage} from "../page/login/login";
import {PreferenceService} from "../service/preference";
import {RegisterChooseProfile} from "../page/register/register-choose-profile/register-choose-profile";
import {UserService} from "../service/user";

@injectable
export class LoginGuard {


    @inject(AuthService)
    authService: AuthService;

    @inject(UserService)
    userService: UserService;


    @inject(PreferenceService)
    preferenceService: PreferenceService;

    autoLogin = async (match: IRouteMatch): Promise<IRouterGuardResponse> => {
        if (await this.authService.autoLogin()) {
            return ConsumerOrderListPage.ROUTE
        }
        return true;
    };

    loggedIn = async (match: IRouteMatch): Promise<IRouterGuardResponse> => {
        try {

            if (!await this.authService.isLoggedIn()) {
                return LoginPage.ROUTE;
            }

            const userProfile = await this.userService.getUserProfile();
            st.debug('guard loggedIn userProfile', userProfile);

            if (!userProfile) {
                return RegisterUserAddressPage.ROUTE;
            }
            const profile = this.preferenceService.getProfile();
            st.debug('guard loggedIn profile', profile);
            if (!profile) {
                return RegisterChooseProfile.ROUTE;
            }
        } catch (e) {
            await window.authService.logout();
            return LoginPage.ROUTE;
        }
        return true;
    };
}

