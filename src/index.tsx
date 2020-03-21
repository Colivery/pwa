import "../node_modules/materialize-css/dist/js/materialize.min.js";
import "../assets/materialize.scss";
import "../assets/global-styles.scss";
//import here injectable fix
import "./service/auth"

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface";
import { PATH_START, PATH_WILDCARD, Route, RouteList } from "springtype/web/router";
import { tsx } from "springtype/web/vdom";
import { LoginPage } from "./page/login/login";
import * as serviceWorker from "./service-worker";
import { pubsub } from "springtype/core/pubsub/pubsub";
import { ConsumerOrderListPage } from "./page/consumer-order-list/consumer-order-list";
import { SplashscreenPage } from "./page/splashscreen/splashscreen";
import { RegisterPage } from "./page/register/register";
import { RegisterUserAddressPage } from "./page/register-user-address/register-user-address";
import { ConsumerOrderDetailPage } from "./page/consumer-order-detail/consumer-order-detail";
import { ConsumerOrderAddPage } from "./page/consumer-order-add/consumer-order-add";
import { inject } from "springtype/core/di";
import { LoginGuard } from "./guard/login-guard";
import { RegisterGuard } from "./guard/register-guard";
import { MatLoadingIndicator } from "./component/mat/mat-loading-indicator";

st.form = {
  ...st.form,
  labelActiveClasses: ['active'],
  invalidClasses: ['invalid'],
  validClasses: ['valid']
};


@component
export class App extends st.component implements ILifecycle {

  @inject(LoginGuard)
  loginGuard: LoginGuard;

  @inject(RegisterGuard)
  registerGuard: RegisterGuard;

  render() {
    return (
      <RouteList>
        <Route path={[PATH_START, PATH_WILDCARD]} displayStyle={'inline'}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <SplashscreenPage />
        </Route>
        <Route cacheGroup="login" path={[LoginPage.ROUTE]} displayStyle={'inline'}
          guard={this.loginGuard.autoLogin}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <LoginPage />
        </Route>
        <Route path={[ConsumerOrderListPage.ROUTE]} displayStyle={'inline'} guard={this.loginGuard.loggedIn}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <ConsumerOrderListPage />
        </Route>
        <Route cacheGroup="register" path={[RegisterPage.ROUTE]} displayStyle={'inline'}
          guard={this.registerGuard.register}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <RegisterPage />
        </Route>

        <Route cacheGroup="register" path={[RegisterUserAddressPage.ROUTE]} displayStyle={'inline'}
          guard={this.registerGuard.registerComplete}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <RegisterUserAddressPage />
        </Route>
        <Route path={[ConsumerOrderDetailPage.ROUTE]} displayStyle={'inline'}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <ConsumerOrderDetailPage />
        </Route>
        <Route path={[ConsumerOrderAddPage.ROUTE]} displayStyle={'inline'}>
          <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
            <MatLoadingIndicator />
          </template>
          <ConsumerOrderAddPage />
        </Route>
      </RouteList>
    );
  }
}


st.enable(pubsub);

st.render(<App />);

serviceWorker.register()