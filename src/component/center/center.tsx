import { st } from "springtype/core";
import { component } from "springtype/web/component";

@component({ tag: 'center' })
export class Center extends st.component {

    style = {
        display: 'block',
        width: '100%',
    };

    render() {
        return this.renderChildren();
    }
}
