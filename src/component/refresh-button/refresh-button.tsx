import "./refresh-button.scss";

import { component } from "springtype/web/component";
import { st } from "springtype/core";
import { ILifecycle } from "springtype/web/component/interface";
import { tsx } from "springtype/web/vdom";

@component({ tag: 'a' })
export class RefreshButton extends st.component implements ILifecycle {

    class = ['btn btn-flat mat-align-middle refresh-button'];

    render() {
        return <fragment>
            <i class="material-icons">find_replace</i> &nbsp;{st.t("Refresh list")}
        </fragment>
    }
}