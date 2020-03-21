import "../node_modules/materialize-css/dist/js/materialize.min.js";
import "../assets/materialize.scss";
import "../assets/global-styles.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface";
import { RouteList, Route, PATH_WILDCARD, PATH_START } from "springtype/web/router";
import { LoginGuard } from "./guard/login-guard";
import { inject } from "springtype/core/di";
import { tsx } from "springtype/web/vdom";
import { LoginPage } from "./page/login/login";
import * as serviceWorker from "./service-worker";
import { pubsub } from "springtype/core/pubsub/pubsub";

@component
export class App extends st.component implements ILifecycle {

  @inject(LoginGuard)
  loginGuard: LoginGuard;

  render() {
    return (
      <RouteList>
        <Route
          path={[PATH_START, PATH_WILDCARD, LoginPage.ROUTE]}>

          <LoginPage />

        </Route>
      </RouteList>
    );
  }
}

st.enable(pubsub);

st.render(<App />);

serviceWorker.register()