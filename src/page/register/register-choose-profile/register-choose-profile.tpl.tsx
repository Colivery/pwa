import {tsx} from "springtype/web/vdom";
import {RegisterChooseProfile} from "./register-choose-profile";
import {LogoRow} from "../../../component/logo-row/logo-row";

export default (component: RegisterChooseProfile) => (
    <div class="container">
        <LogoRow/>
        <div class="row">
            <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                <center>
                    <p>Are you driver or consumer ?</p>
                    <a href="javascript:void(0)" onClick={() =>component.onNextClick('driver')}>
                        <img height={150} src={require('../../../../assets/images/driver.svg')}/>
                    </a>
                    <br/>
                    <br/>
                    <br/>
                    <a href="javascript:void(0)" onclick={() => component.onNextClick('consumer')}>
                        <img height={150} src={require('../../../../assets/images/consumer.svg')}/>
                    </a>
                </center>
            </div>

        </div>
    </div>
)

