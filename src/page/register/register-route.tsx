import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface";
import {Route, RouteList} from "springtype/web/router";
import {tsx} from "springtype/web/vdom";
import {inject} from "springtype/core/di";
import {RegisterGuard} from "../../guard/register-guard";
import {RegisterPage} from "./register-account/register";
import {RegisterUserAddressPage} from "./register-user-address/register-user-address";
import {MatLoadingIndicator} from "../../component/mat/mat-loading-indicator";
import {RegisterChooseProfile} from "./register-choose-profile/register-choose-profile";
import {component} from "springtype/web/component";

@component
export class RegisterRoute extends st.component implements ILifecycle {

    @inject(RegisterGuard)
    registerGuard: RegisterGuard;

    render() {
        return (
            <RouteList>
                {/* register stuff*/}
                <Route cacheGroup="register" path={[RegisterPage.ROUTE]} displayStyle={'inline'}
                       guard={this.registerGuard.register}>
                    <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                        <MatLoadingIndicator/>
                    </template>
                    <RegisterPage/>
                </Route>
                <Route cacheGroup="register" path={[RegisterUserAddressPage.ROUTE]} displayStyle={'inline'}
                       guard={this.registerGuard.registerComplete}>
                    <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                        <MatLoadingIndicator/>
                    </template>
                    <RegisterUserAddressPage/>
                </Route>
                <Route cacheGroup="register" path={[RegisterChooseProfile.ROUTE]} displayStyle={'inline'}
                       guard={this.registerGuard.registerComplete}>
                    <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                        <MatLoadingIndicator/>
                    </template>
                    <RegisterChooseProfile/>
                </Route>
            </RouteList>
        );
    }
}