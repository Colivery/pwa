import { component } from "springtype/web/component";
import { st } from "springtype/core";
import { ILifecycle } from "springtype/web/component/interface";
import { tsx } from "springtype/web/vdom";

@component({ tag: 'span' })
export class MatLoaderCircle extends st.component implements ILifecycle {

    class = ['valign-wrapper', 'hide'];

    style = { flexDirection: 'column' };

    render() {
        return <div class="preloader-wrapper active center-align">
            <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    }

    setVisible(isVisible: boolean) {
        if (isVisible) {
            this.el.classList.remove('hide');
        } else {
            this.el.classList.add('hide');
        }
    }
}