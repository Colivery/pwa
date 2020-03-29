import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../../component/nav-header/nav-header";
import { DriverOrderList } from "./driver-order-list";
import { MatLoadingIndicator } from "../../../component/mat/mat-loading-indicator";
import { calculateAvailableHeightPercent } from "../../../function/calculate-available-height-percent";
import { MatModal } from "../../../component/mat/mat-modal";
import { EsriMap } from "../../../component/esri/EsriMap";

export default (component: DriverOrderList) => (
    <fragment>
        <NavHeader showBackButton={false} showAddButton={false} showRefreshButton={true} onRefreshButtonClick={component.onRefreshButtonClick} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">
            <div class="order-tabs">
                <a href="javascript:" ref={{ openOrdersTabLink: component }} onClick={component.activateOpenOrdersTab} class="order-active-tab"><h3 class="slogan">Freie</h3></a>
                <h3 class="slogan">&nbsp;/&nbsp;</h3>
                <a href="javascript:" ref={{ myOrdersTabLink: component }} onClick={component.activateMyOrdersTab}><h3 class="slogan">Meine Aufträge</h3></a>
            </div>

            <div id="open-orders" ref={{ openOrdersTab: component }}>

                <p class="range-field order-range-field">
                    <p>Im Umkreis von: <span class="badge">{component.range} km</span></p>
                    <input type="range" min="1" max="50" value={component.range} onChange={component.onRangeChange} />
                </p>

                <EsriMap height={calculateAvailableHeightPercent(20)} ref={{ map: component }}></EsriMap>

                <br />

                <div class="horizontal-scroll hide" ref={{ openOrdersScrollContainer: component }}></div>
            </div>

            <span id="my-orders" class="hide" ref={{ myOrdersTab: component }}>
                <div class="horizontal-scroll hide" ref={{ myOrdersScrollContainer: component }}></div>
            </span>

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

        <MatModal ref={{ confirmAcceptOrderModal: component }}>

            <h4 class={'center'}><i class="material-icons">done_all</i> Auftrag annehmen</h4>

            Bist Du Dir sicher, dass Du diese Fahrt übernehmen kannst? Es ist sehr frustrierend für die andere Person, wenn es doch nicht klappt.

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>

            <a href="javascript:" onclick={component.onCancelAccept} class="modal-close waves-effect btn-footer-secondary waves-white btn material-align-middle"><i class="material-icons">highlight_off</i> &nbsp;Nein</a>
                <a href="javascript:" onclick={component.onReallyAcceptOrder} class="modal-close waves-effect btn waves-white material-align-middle"><i class="material-icons">done_all</i> &nbsp;Ja</a>
            </template>
        </MatModal>

        <a onClick={component.onRefreshButtonClick} class="action-button btn-floating btn-large halfway-fab waves-effect waves-light red pulse">
            <i class="material-icons">refresh</i>
        </a>
    </fragment>
)