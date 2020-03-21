import {SplashscreenPage} from "./splashscreen";
import {tsx} from "springtype/web/vdom";

export default (component: SplashscreenPage) => (
    <div class="container">
        <center><img src={require('../../../static/assets/icons/favicon.png')}/></center>
    </div>
)