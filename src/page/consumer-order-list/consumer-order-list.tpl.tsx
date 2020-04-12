import { ConsumerOrderListPage } from "./consumer-order-list";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatModal, MatLoadingIndicator } from "st-materialize";
import { ModalMiddleContent } from "../../component/modal-middle-content/modal-middle-content";
import { Center } from "../../component/center/center";
import { st } from "springtype/core";
import { RefreshButton } from "../../component/refresh-button/refresh-button";

export default (component: ConsumerOrderListPage) => (
    <fragment>
        <NavHeader showBackButton={false} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">

            <h3 class="slogan">{st.t("My Requests (Requestor)")}</h3>

            <Center>
                <RefreshButton ref={{ refreshButton: component }} onClick={component.onRefreshButtonClick} />
            </Center>
            <br />

            <div class="horizontal-scroll hide" ref={{ myOrdersScrollContainer: component }}></div>

            <span class="valign-wrapper hide" style={{ flexDirection: 'column' }} ref={{ loadingComponent: component }}>
                <br /><br />
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

            <Center ref={{ scrollSwipeDisplayRef: component }}>
                <p class="hint material-align-middle">
                    <i class="material-icons">arrow_left</i> {st.t("scroll / swipe")} <i class="material-icons">arrow_right</i>
                </p>
            </Center>

            <Center style={{ width: '100vw', left: 0, position: 'fixed', bottom: '20px' }}>
                <a href="javascript:" onClick={component.onAddButtonClick} class="btn btn-large waves-effect waves-light material-align-middle"><i class="material-icons">add</i> {st.t("New Request")}</a>
            </Center>

        </div>

        <MatModal ref={{ myOrderDetailsModal: component }}>

            <ModalMiddleContent>
                <Center style={{ height: '100%' }}>
                    <h3>{st.t('Shopping list:')}</h3>

                    <div ref={{ myOrderDetailsContainer: component }}></div>
                </Center>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.myOrderDetailsModal.toggle();
                }} class="modal-close waves-effect waves-green btn-flat btn btn-full-width">
                    {st.t("OK")}
                </a>
            </template>
        </MatModal>

        <MatModal ref={{ cancelOrderModal: component }}>

            <ModalMiddleContent>
                <Center>
                    <h4><i class="material-icons">cancel</i> {st.t("Cancel Request")}</h4>

                    {st.t("Are you sure you want to cancel this shopping request?")}
                </Center>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.cancelOrderModal.toggle()} class="modal-close waves-effect waves-white btn material-align-middle left"><i class="material-icons">highlight_off</i> &nbsp;{st.t("No")}</a>
                <a href="javascript:" onclick={component.onReallyCancelOrder} class="modal-close waves-effect btn waves-green material-align-middle btn-flat"><i class="material-icons">done_all</i> &nbsp;{st.t("Yes")}</a>
            </template>
        </MatModal>

    </fragment>
)