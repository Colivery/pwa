import "./mat-loading-indicator.scss"
import { tsx } from "springtype/web/vdom";
import { component } from "springtype/web/component";
import { st } from "springtype/core";
import { ref } from "springtype/core/ref";

@component
export class MatLoadingIndicator extends st.component {

    visible: boolean = true;

    @ref
    container: HTMLElement;

    toggle() {
        this.visible = !this.visible;
        this.setVisible(this.visible);
    }

    setVisible(visible: boolean) {
        this.visible = visible;

        if (visible) {
            this.container.classList.remove('hide');
        } else {

            this.container.classList.add('hide');
        }
    }

    render() {
        return <div ref={{ container: this }} class={["progress", "mat-loading-indicator"]}>
            <div class="indeterminate"></div>
        </div>
    }
}