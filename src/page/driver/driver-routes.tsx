import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface";
import {Route, RouteList} from "springtype/web/router";
import {tsx} from "springtype/web/vdom";
import {inject} from "springtype/core/di";
import {component} from "springtype/web/component";
import {DriverOrderList} from "./driver-order-list/driver-order-list";
import {MatLoadingIndicator} from "../../component/mat/mat-loading-indicator";
import {LoginGuard} from "../../guard/login-guard";

@component
export class DriverRoute extends st.component implements ILifecycle {


    @inject(LoginGuard)
    loginGuard: LoginGuard;

    render() {
        return (
            <RouteList>
                {/* register stuff*/}
                <Route path={[DriverOrderList.ROUTE]} displayStyle={'inline'} guard={this.loginGuard.loggedIn}>
                    <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                        <MatLoadingIndicator/>
                    </template>
                    <DriverOrderList/>
                </Route>
            </RouteList>
        );
    }
}