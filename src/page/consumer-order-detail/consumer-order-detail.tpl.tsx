import {ConsumerOrderDetailPage} from "./consumer-order-detail";
import {tsx} from "springtype/web/vdom";
import {NavHeader} from "../../component/nav-header/nav-header";
import {MatModal} from "../../component/mat/mat-modal";
import {OrderItemRow} from "./order-item-row";
import {OrderItem} from "../../datamodel/order";
import {OrderTable} from "./order-table";
import {OrderHeader} from "./order-header";
import {OderStatusCard} from "./oder-status-card";
import {OrderDriverStatus} from "./order-driver-status";

export default (component: ConsumerOrderDetailPage) => (
    <fragment>
        <NavHeader showBackButton={true} />

        {getContainer(component)}

        <MatModal ref={{confirmDeleteItemModal: component}}>

            <h4 class={'center'}>Artikel löschen</h4>

            Wollen Sie dieses Item wirklich löschen?

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.confirmDeleteItemModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat">close</a>
            </template>
        </MatModal>

    </fragment>
)

const getContainer = (component: ConsumerOrderDetailPage) => {
    if (!component.orderState) {
        // if state not set
        return <fragment/>
    }
    const delivery = component.orderState.status != 'to_be_delivered';
    return <div class="container">

        <OrderHeader order={component.orderState}/>

        <OrderDriverStatus />

        <OrderTable>
            {component.orderState.items.map((item: OrderItem) => <OrderItemRow item={item} delivery={delivery}/>)}
        </OrderTable>

        <div class="row">
            <div class={['col', 's12', 'center']}>
                <h5>Hinweise</h5>
                <span>{component.orderState.hint || 'kein Hinweis für den Fahrer'}</span>
            </div>
        </div>
        <OderStatusCard toBeDelivered={!delivery}/>
    </div>
}

