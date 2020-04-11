import "./modal-middle-content.scss";
import { st } from "springtype/core";
import { component } from "springtype/web/component";

@component({ tag: 'div' })
export class ModalMiddleContent extends st.component {

    class = "modal-middle-content";

    render() {
        return this.renderChildren();
    }
}
