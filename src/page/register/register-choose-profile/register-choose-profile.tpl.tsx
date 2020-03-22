import {tsx} from "springtype/web/vdom";
import {RegisterChooseProfile} from "./register-choose-profile";
import {LogoRow} from "../../../component/logo-row/logo-row";

export default (component: RegisterChooseProfile) => (
    <div class="container">
        <LogoRow/>
        <div class="row">
            <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                <center>
                    <p>Möchtest Du im Moment als Fahrer helfen oder brauchst Du etwas?</p>
                    <br/>
                    <a href="javascript:" onClick={() =>component.onNextClick('driver')}>
                        <img height={100} src={require('../../../../assets/images/driver.svg')}/><br />
                        Ich möchte als Fahrer helfen
                    </a>
                    <br/>
                    <br/>
                    <a href="javascript:" onclick={() => component.onNextClick('consumer')}>
                        <img height={100} src={require('../../../../assets/images/consumer.svg')}/><br />
                        Ich brauche etwas
                    </a>
                </center>
            </div>

        </div>
    </div>
)

