import { st } from "springtype/core";
import { component } from "springtype/web/component";

@component({ tag: 'center' })
export class Center extends st.component {

    render() {
        return this.renderChildren();
    }
}
