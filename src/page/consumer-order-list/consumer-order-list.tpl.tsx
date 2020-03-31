import { ConsumerOrderListPage } from "./consumer-order-list";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { MatModal } from "../../component/mat/mat-modal";

export default (component: ConsumerOrderListPage) => (
    <fragment>
        <NavHeader showBackButton={false} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">

            <h3 class="slogan">Meine Aufträge</h3>

            <div class="horizontal-scroll hide" ref={{ myOrdersScrollContainer: component }}></div>

            <br /><br /><br />

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
            </span>
        </div>

        <MatModal ref={{ myOrderDetailsModal: component }}>

            <h3 class={'center'}>Einkauf</h3>

            <div ref={{ myOrderDetailsContainer: component }}></div>

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.myOrderDetailsModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat material-align-middle">
                    <i class="material-icons">close</i>&nbsp;Schließen
                </a>
            </template>
        </MatModal>

        <MatModal ref={{ cancelOrderModal: component }}>

            <h4 class={'center'}><i class="material-icons">cancel</i> Auftrag abbrechen</h4>

            Bist Du Dir sicher, dass Du den Einkaufsauftrag abbrechen möchtest?

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.cancelOrderModal.toggle()} class="modal-close waves-effect btn-footer-secondary waves-white btn material-align-middle"><i class="material-icons">highlight_off</i> &nbsp;Nein</a>
                <a href="javascript:" onclick={component.onReallyCancelOrder} class="modal-close waves-effect btn waves-white material-align-middle cancel-button"><i class="material-icons">done_all</i> &nbsp;Ja</a>
            </template>
        </MatModal>

        <a onClick={component.onAddButtonClick} class="action-button btn-floating btn-large halfway-fab waves-effect waves-light red pulse">
            <i class="material-icons">add</i>
        </a>


        <a onClick={component.onRefreshButtonClick} ref={{ refreshButton: component }} style={{ marginRight: '80px', marginTop: '10px' }} class="action-button btn-floating btn-large halfway-fab waves-effect waves-light btn-small red pulse">
            <i class="material-icons">refresh</i>
        </a>

    </fragment>
)