import { tsx } from "springtype/web/vdom";
import { LogoRow } from "../../component/logo-row/logo-row";
import { st } from "springtype/core";
import { EmailActionPage } from "./email-action";
import { MatLoaderCircle } from "st-materialize";
import { ErrorMessage } from "../../component/error-message/error-message";

export default (component: EmailActionPage) => (
    <fragment>
        <div class="container">
            <LogoRow />

            <h3 class="slogan" ref={{ headerRef: component }}>
            </h3>


            <div class="row">
                <div class="col s12 m6 offset-m3 l6 offset-l3">

                    <MatLoaderCircle ref={{ matLoaderCircleRef: component }} />

                    <ErrorMessage ref={{ errorMessageRef: component }} />
                </div>
            </div>

        </div>
    </fragment >
);