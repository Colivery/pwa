import { st } from "springtype/core";
import { component, state } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-detail.tpl";
import "./consumer-order-detail.scss";
import { context } from "springtype/core/context/context";
import { ORDER_CONTEXT, getOrderContext } from "../../context/order";
import { MatModal } from "../../component/mat/mat-modal";
import { ref } from "springtype/core/ref";

@component({
    tpl
})
export class ConsumerOrderDetailPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-detail/:id";

    @ref
    confirmDeleteItemModal: MatModal;

    @state
    orderState: any = {};

    @context(ORDER_CONTEXT)
    orderContext: any = getOrderContext();

    driverContext: any = {
        name: 'Aron Homberg',
        phone: '+49 170 54 7 44 55',
        email: 'info@aron-homberg.de'
    };

    onRouteEnter() {
        this.orderState.id = st.route.params.id;
    }

    onDeleteButtonClick = (evt: MouseEvent) => {

        const orderItemId = (evt.target as HTMLElement).closest('tr').getAttribute('data-id');

        console.log('Delete item', orderItemId);

        this.confirmDeleteItemModal.toggle();

    }

    getStatusText(status: string) {

        switch (status) {
            case "accepted":
                return "Auf dem Weg zu Dir";
            case "to_be_delivered":
                return "Bisher kein Fahrer gefunden";
            case "delivered":
                return "Erfolgreich geliefert";
            case "consumer_canceled":
                return "Abbruch durch Dich";
        }
    }

    getStatusEmoji(itemStatus: string) {
        switch(itemStatus) {
            case "todo":
                return "⏳";
            case "done":
                return "✅";
        }
    }
}
