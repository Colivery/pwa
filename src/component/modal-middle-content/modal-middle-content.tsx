import { st } from "springtype/core";
import { component } from "springtype/web/component";

@component({ tag: 'div' })
export class ModalMiddleContent extends st.component {

    style = {
        width: '100%',
        height: '100%'
    };

    render() {
        return this.renderChildren();
    }
}
