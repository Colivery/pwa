import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import "./logo-row.scss";

@component
export class LogoRow extends st.component {

    render() {
        return <div class="row">
            <center><img src={require('../../../static/assets/icons/favicon.png')} /></center>
        </div>
    }
}
