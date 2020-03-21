import "./mat-loading-indicator.scss"
import { tsx } from "springtype/web/vdom";
import { component } from "springtype/web/component";
import { st } from "springtype/core";

@component
export class MatLoadingIndicator extends st.component {
    render() {
        return <div class="progress mat-loading-indicator">
            <div class="indeterminate"></div>
        </div>
    }
}