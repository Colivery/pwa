import { st } from "springtype/core";
import { tsx } from "springtype/web/vdom";
import { injectable } from "springtype/core/di";
import { IVirtualNode } from "springtype/web/vdom/interface";

@injectable
export class SplashscreenService {

    show() {
        st.dom.removeChildren(document.body);
        st.render(this.render());
    }

    render(): IVirtualNode {
        return <div class="page-splashscreen">
            <img src={require("../../assets/images/logo_white_transparent.png")} />
        </div>;
    }
}