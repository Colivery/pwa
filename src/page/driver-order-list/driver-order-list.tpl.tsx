import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { DriverOrderList } from "./driver-order-list";
import { MatLoadingIndicator, MatModal } from "st-materialize";
import { st } from "springtype/core";
import { ModalMiddleContent } from "../../component/modal-middle-content/modal-middle-content";
import { Center } from "../../component/center/center";
import { RefreshButton } from "../../component/refresh-button/refresh-button";

export default (component: DriverOrderList) => (
    <fragment>
        <NavHeader showBackButton={false} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">
            <div class="order-tabs">
                <a href="javascript:" ref={{ openOrdersTabLink: component }} onClick={component.activateOpenOrdersTab} class="order-active-tab"><h3 class="slogan">{st.t("Open Requests")}</h3></a>
                <h3 class="slogan">&nbsp;/&nbsp;</h3>
                <a href="javascript:" ref={{ myOrdersTabLink: component }} onClick={component.activateMyOrdersTab}><h3 class="slogan">{st.t("My Requests")}</h3></a>
            </div>

            <div id="open-orders" ref={{ openOrdersTab: component }}>

                <p class="range-field order-range-field">
                    <p>{st.t("In a Radius of:")} <span class="badge"><span ref={{ rangeDisplay: component }}>{component.range}</span> {st.t("km")}</span></p>
                    <input style={{ width: '100%' }} type="range" min="1" max="50" value={component.range} onChange={component.onRangeChange} />
                </p>

                <Center>
                    <img class="static-map" ref={{ map: component }} style={{ marginBottom: '10px' }} />
                </Center>

                <Center>
                    <RefreshButton ref={{ openOrdersRefreshButton: component }} onClick={component.onRefreshButtonClick} />
                </Center>

                <div class="horizontal-scroll hide" ref={{ openOrdersScrollContainer: component }}></div>

                <Center ref={{ openOrdersSwipeDisplayRef: component }}>
                    <p class="hint material-align-middle">
                        <i class="material-icons">arrow_left</i> {st.t("scroll / swipe")} <i class="material-icons">arrow_right</i>
                    </p>
                </Center>

                <span class="valign-wrapper hide" style={{ flexDirection: 'column', height: '160px' }} ref={{ openOrdersLoadingComponent: component }}>

                    <Center>
                        <br />
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
                        <br />
                        <br />
                        {st.t("One moment, we are searching for open requests")}...
                    </Center>
                </span>
            </div>

            <span id="my-orders" class="hide" ref={{ myOrdersTab: component }}>

                <Center>
                    <RefreshButton ref={{ myOrdersRefreshButton: component }} onClick={component.onRefreshButtonClick} />
                </Center>

                <div class="horizontal-scroll hide" ref={{ myOrdersScrollContainer: component }}></div>

                <Center ref={{ myOrdersSwipeDisplayRef: component }}>
                    <p class="hint material-align-middle">
                        <i class="material-icons">arrow_left</i> {st.t("scroll / swipe")} <i class="material-icons">arrow_right</i>
                    </p>
                </Center>

                <span class="valign-wrapper hide" style={{ flexDirection: 'column', height: '160px' }} ref={{ myOrdersLoadingComponent: component }}>

                    <br />
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
                    <br />
                    <br />
                    <Center>
                        {st.t("One moment, we are searching for your requests")}...<br />
                    </Center>
                </span>
                <br />
            </span>
        </div>

        <MatModal ref={{ confirmAcceptOrderModal: component }}>

            <ModalMiddleContent>
                <Center style={{ height: '100%' }}>
                    <h4><i class="material-icons">done_all</i> {st.t("Accept request")}</h4>

                    <div ref={{ confirmOrderItemListContainer: component }}></div>

                    {st.t("* When you accept a request, your contact details, will be shared with the requestor.")}
                </Center>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={component.onCancelAccept} class="modal-close waves-effect waves-white btn material-align-middle left"><i class="material-icons">highlight_off</i> &nbsp;{st.t("No")}</a>
                <a href="javascript:" onclick={component.onReallyAcceptOrder} class="modal-close waves-effect btn waves-green material-align-middle btn-flat"><i class="material-icons">done_all</i> &nbsp;{st.t("Yes")}</a>
            </template>
        </MatModal>

        <MatModal ref={{ markOrderDeliveredModal: component }}>

            <ModalMiddleContent>
                <Center>
                    <h4><i class="material-icons">done_all</i> {st.t("Finish Request")}</h4>

                    {st.t("Are you sure, you want to")} <strong>{st.t("finish")}</strong> {st.t("this request?")}
                    {st.t("You should have delivered the purchase and already received your money.")}
                </Center>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.markOrderDeliveredModal.toggle()} class="modal-close waves-effect waves-white btn material-align-middle left"><i class="material-icons">highlight_off</i> &nbsp;{st.t("No")}</a>
                <a href="javascript:" onclick={component.onReallyMarkOrderDelivered} class="modal-close waves-effect btn waves-green material-align-middle btn-flat"><i class="material-icons">done_all</i> &nbsp;{st.t("Yes")}</a>
            </template>
        </MatModal>

        <MatModal ref={{ myOrderDetailsModal: component }}>

            <ModalMiddleContent>
                <Center style={{ height: '100%' }}>
                    <h3>{st.t("Request")}</h3>

                    <div ref={{ myOrderDetailsContainer: component }}></div>
                </Center>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <Center>
                    <a href="javascript:" onclick={() => {
                        component.myOrderDetailsModal.toggle();
                    }} class="modal-close waves-effect waves-green btn-flat material-align-middle">
                        <i class="material-icons">close</i>&nbsp;{st.t("Close")}
                    </a>
                </Center>
            </template>
        </MatModal>

        <MatModal ref={{ abortOrderModal: component }}>

            <ModalMiddleContent>
                <Center>
                    <h4><i class="material-icons">cancel</i> {st.t("Cancel request")}</h4>

                    {st.t("Are you sure you want to cancel this request?")}
                </Center>
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.abortOrderModal.toggle()} class="modal-close waves-effect waves-white btn material-align-middle left"><i class="material-icons">highlight_off</i> &nbsp;{st.t("No")}</a>
                <a href="javascript:" onclick={component.onReallyAbortOrder} class="modal-close waves-effect btn waves-green material-align-middle btn-flat"><i class="material-icons">done_all</i> &nbsp;{st.t("Yes")}</a>
            </template>
        </MatModal>

    </fragment>
)