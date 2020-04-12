import { injectable } from "springtype/core/di";
import { st } from "springtype/core";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { tsx } from "springtype/web/vdom";
import { MatModal } from "st-materialize";
import { T } from "springtype/web/i18n/t";
import { ref } from "springtype/core/ref";
import { Center } from "../component/center/center";
import { ModalMiddleContent } from "../component/modal-middle-content/modal-middle-content";

@injectable
export class ErrorService extends st.component {

    @ref
    modal: MatModal;

    show() {
        st.dom.removeChildren(document.body);
        st.render(this.render());

        setImmediate(() => {
            // two button rows
            (this.modal.el.querySelector('.modal-footer') as HTMLElement)!.style.height = '135px';
            this.modal.toggle();
        })
    }

    render(): IVirtualNode {
        return <MatModal ref={{ modal: this }}>

            <ModalMiddleContent>
                <Center>
                    <img style={{ width: '25vw', maxWidth: '100px' }} src={require("../../assets/images/logo_white_transparent.png")} />

                    <br /><br />
                    <br /><br />

                    <T tag="h4" class={'center'}>Error</T>

                    <T tag="p">Something went wrong. Please reload the app.</T>
                </Center>
            </ModalMiddleContent>

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <Center>
                    <T tag="a" href="javascript:" onclick={() => {
                        window.authService.logout()
                    }} class="modal-close waves-effect waves-red btn-flat btn-full-width">Logout</T>
                    <T tag="a" href="javascript:" onclick={() => {
                        document.location.reload()
                    }} class="modal-close waves-effect waves-red btn-flat btn-full-width">Reload</T>
                </Center>
            </template>
        </MatModal>
    }
}