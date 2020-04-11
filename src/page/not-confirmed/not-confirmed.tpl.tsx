import { tsx } from "springtype/web/vdom";
import { LogoRow } from "../../component/logo-row/logo-row";
import { st } from "springtype/core";
import { NotConfirmedPage } from "./not-confirmed";
import { Center } from "../../component/center/center";
import { MatLoaderCircle } from "st-materialize";

export default (component: NotConfirmedPage) => (
    <fragment>
        <div class="container">
            <LogoRow />

            <h3 class="slogan">
                {st.t("Account not confirmed yet")}
            </h3>

            <div class="row">
                <div class="col s12 m6 offset-m3 l6 offset-l3">

                    <p ref={{ messageRef: component }}>

                    </p>

                    <p ref={{ emailDisplayRef: component }}></p>

                    <MatLoaderCircle ref={{ matLoaderCircle: component }} class="hide" />

                    <br />

                    <Center>
                        <a href="javascript:" ref={{ resendVerificationButtonRef: component }} onclick={component.onReSendVerificationEmailClick} class="waves-effect waves-white btn material-align-middle">
                            <i class="material-icons">done</i> &nbsp;{st.t("Resend email")}</a>

                        <a href="javascript:" ref={{ nextButtonRef: component }} onclick={component.onNextButtonClick} class="waves-effect waves-white btn material-align-middle hide">
                            {st.t("Next")}</a>
                    </Center>
                </div>
            </div>
        </div>
    </fragment >
);