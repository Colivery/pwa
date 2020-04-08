import { tsx } from "springtype/web/vdom";
import { RegisterChooseProfile } from "./register-choose-profile";
import { LogoRow } from "../../../component/logo-row/logo-row";
import { st } from "springtype/core";

export default (component: RegisterChooseProfile) => (
    <div class="container">
        <LogoRow />
        <div class="row">
            <div class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3', 'center-align']}>
                <p>{st.t("Would you currently like to help as a driver or do you need help with your shopping?")}</p>
                <br />
                <a href="javascript:" onclick={() => component.onNextClick('consumer')}>
                    <img height={100} src={require('../../../../assets/images/consumer.svg')} /><br />
                        {st.t("I need help with shopping")}
                    </a>
                <br />
                <br />
                <a href="javascript:" onClick={() => component.onNextClick('driver')}>
                    <img height={100} src={require('../../../../assets/images/driver.svg')} /><br />
                        {st.t("I want to help as a driver")}
                    </a>
            </div>

        </div>
    </div>
)

