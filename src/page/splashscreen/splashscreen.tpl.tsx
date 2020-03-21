import { SplashscreenPage } from "./splashscreen";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput } from "../../component/mat/mat-input";
import { email, minLength, required } from "springtype/core/validate";
import { Form } from "springtype/web/form";

export default (component: SplashscreenPage) => (
    <fragment>
        <div class="container">
            <center><img src={require('../../../static/assets/icons/favicon.png')} /></center>
        </div>
    </fragment>
)