import { SplashscreenPage } from "./splashscreen";
import { tsx } from "springtype/web/vdom";
import { LogoRow } from "../../component/logo-row/logo-row";

export default (component: SplashscreenPage) => (
    <fragment>
        <br /><br /><br />
        <LogoRow />
    </fragment>
)