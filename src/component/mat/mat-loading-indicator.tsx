import "./mat-loading-indicator.scss"
import { tsx } from "springtype/web/vdom";
import { component } from "springtype/web/component";
import { st } from "springtype/core";

@component
export class MatLoadingIndicator extends st.component {

    visible: boolean = true;

    toggle() {
        this.visible = !this.visible;
        this.doRender();
    }

    setVisible(visible: boolean) {
        this.visible = visible;
        this.doRender();
    }

    render() {
        return <div class={["progress", "mat-loading-indicator", !this.visible ? "hide" : '']}>
            <div class="indeterminate"></div>
        </div>
    }
}