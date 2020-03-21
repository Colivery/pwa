import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import "./logo-row.scss";

@component
export class LogoRow extends st.component {

    render() {
        return <div class="logo row">
            <center><img src={require('../../../assets/images/logo.png')} /></center>
        </div>
    }
}
