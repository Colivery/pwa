import "../node_modules/materialize-css/dist/js/materialize.min.js";
import "../assets/materialize.scss";
import "st-materialize";
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
import { ConsumerOrderAddPage } from "./page/consumer-order-add/consumer-order-add";
import { inject } from "springtype/core/di";
import { LoginGuard } from "./guard/login-guard";
import { RegisterGuard } from "./guard/register-guard";
import { MatLoadingIndicator } from "./component/mat/mat-loading-indicator";
import { RegisterRoute } from "./page/register/register-route";
import { UserProfilePage } from "./page/user-profile/user-profile";
import { DriverOrderList } from "./page/driver-order-list/driver-order-list";
import { GeoService } from "./service/geo";
import { I18nService, SupportedLanguages } from "./service/i18n";
import { T } from "springtype/web/i18n/t";

st.form = {
    ...st.form,
    labelActiveClasses: ['active'],
    invalidClasses: ['invalid'],
    validClasses: ['valid']
};

@component
export class App extends st.component implements ILifecycle {

    @inject(I18nService)
    i18nService: I18nService;

    @inject(LoginGuard)
    loginGuard: LoginGuard;

    @inject(RegisterGuard)
    registerGuard: RegisterGuard;

    @inject(GeoService)
    geoService: GeoService;


    constructor() {
        super();

        // example:
        this.i18nService.setLanguage(SupportedLanguages.DE);


        console.log('endpoint', process.env.ST_SERVICE_API_ENDPOINT);


        /*
        console.log('geoService', this.geoService.haversine({
            latitude: 48.330713,
            longitude: 12.003011
        }, {
            latitude: 48.348057,
            longitude: 12.077770
        }));
        */
    }


    render() {
        return (
            <fragment>
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

                    <Route path={[ConsumerOrderListPage.ROUTE]} displayStyle={'inline'}
                        guard={this.loginGuard.loggedIn}>
                        <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                            <MatLoadingIndicator />
                        </template>
                        <ConsumerOrderListPage />
                    </Route>

                    <Route path={[ConsumerOrderAddPage.ROUTE]} displayStyle={'inline'} guard={this.loginGuard.loggedIn}>
                        <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                            <MatLoadingIndicator />
                        </template>
                        <ConsumerOrderAddPage />
                    </Route>
                    <Route path={[UserProfilePage.ROUTE]} displayStyle={'inline'} guard={this.loginGuard.loggedIn}>
                        <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                            <MatLoadingIndicator />
                        </template>
                        <UserProfilePage />
                    </Route>

                    <Route path={[DriverOrderList.ROUTE]} displayStyle={'inline'} guard={this.loginGuard.loggedIn}>
                        <template slot={Route.SLOT_NAME_LOADING_COMPONENT}>
                            <MatLoadingIndicator />
                        </template>
                        <DriverOrderList />
                    </Route>

                </RouteList>

                <RegisterRoute />

            </fragment>
        );
    }
}


st.enable(pubsub);

st.render(<App />);

serviceWorker.register()