import "./mat-modal.css"
import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface";
import {tsx} from "springtype/web/vdom";
import {attr, component} from "springtype/web/component";
import { ref } from "springtype/core/ref";

export interface IAttrMatModal {

}

export interface IMatModalState {
    open: boolean
    fixedFooter?: boolean
}

@component
export class MatModal extends st.component<IAttrMatModal> implements ILifecycle {
    static MAT_MODAL_FOOTER_SLOT_NAME = 'MAT_MODAL_FOOTER_SLOT_NAME';

    @attr
    name: string;

    @attr
    fixedFooter = true;
    
    @ref
    container: HTMLElement;

    state: IMatModalState = {
        open: false
    };

    render() {
        return <fragment>
            <div ref={{ container: this }} class={['modal', this.fixedFooter ? 'modal-fixed-footer' : '']} tabindex="0">
                <div class="modal-content">
                    {this.renderChildren()}
                </div>
                <div class="modal-footer">
                    {this.renderSlot(MatModal.MAT_MODAL_FOOTER_SLOT_NAME)}
                </div>
            </div>
            <div class={['modal-overlay']}/>
        </fragment>
    }

    toggle() {
        this.state.open = !this.state.open;

        if (this.state.open) {
            this.container.classList.add('open');
        } else {
            this.container.classList.remove('open');
        }
    }
}