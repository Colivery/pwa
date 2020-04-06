import { ConsumerOrderListPage } from "./consumer-order-list";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatModal, MatLoadingIndicator } from "st-materialize";
import { ModalMiddleContent } from "../../component/modal-middle-content/modal-middle-content";
import { Center } from "../../component/center/center";

export default (component: ConsumerOrderListPage) => (
    <fragment>
        <NavHeader showBackButton={false} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">

            <h3 class="slogan">Meine Aufträge</h3>

            <div class="horizontal-scroll hide" ref={{ myOrdersScrollContainer: component }}></div>

            <span class="valign-wrapper hide" style={{ flexDirection: 'column' }} ref={{ loadingComponent: component }}>
                <div class="preloader-wrapper active center-align">
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
                <br /><br />
            </span>

            <Center>
                <p class="hint material-align-middle">
                    <i class="material-icons">arrow_left</i> scrollen / swipen <i class="material-icons">arrow_right</i>
                </p>
            </Center>

            <br />
            <Center>
                <a href="javascript:" onClick={component.onAddButtonClick} class="btn btn-large red pulse waves-effect waves-light material-align-middle"><i class="material-icons">add</i> Neuer Auftrag</a>
            </Center>

        </div>

        <MatModal ref={{ myOrderDetailsModal: component }}>


            <ModalMiddleContent>
                <h3 class={'center'}>Einkauf</h3>

                <div ref={{ myOrderDetailsContainer: component }}></div>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.myOrderDetailsModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat material-align-middle">
                    <i class="material-icons">close</i>&nbsp;Schließen
                </a>
            </template>
        </MatModal>

        <MatModal ref={{ cancelOrderModal: component }}>

            <ModalMiddleContent>
                <h4 class={'center'}><i class="material-icons">cancel</i> Auftrag abbrechen</h4>

            Bist Du Dir sicher, dass Du den Einkaufsauftrag abbrechen möchtest?
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.cancelOrderModal.toggle()} class="modal-close waves-effect btn-footer-secondary waves-white btn material-align-middle"><i class="material-icons">highlight_off</i> &nbsp;Nein</a>
                <a href="javascript:" onclick={component.onReallyCancelOrder} class="modal-close waves-effect btn waves-white material-align-middle cancel-button"><i class="material-icons">done_all</i> &nbsp;Ja</a>
            </template>
        </MatModal>

        <a onClick={component.onRefreshButtonClick} ref={{ refreshButton: component }} class="action-button btn-floating btn-large halfway-fab waves-effect waves-light red pulse">
            <i class="material-icons">refresh</i>
        </a>

    </fragment>
)