import { ConsumerOrderListPage } from "./consumer-order-list";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";

export default (component: ConsumerOrderListPage) => (
    <fragment>
        <NavHeader showBackButton={false} showAddButton={true} onAddButtonClick={component.onAddButtonClick} />

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

    </fragment>
)