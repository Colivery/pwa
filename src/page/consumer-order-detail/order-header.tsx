import {getOrderStatusTextColorClass} from "../../function/get-order-status-text-color-class";
import {getOrderStatusText} from "../../function/get-order-status-text";
import {tsx} from "springtype/web/vdom";
import {attr, component} from "springtype/web/component";
import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {OrderItem, OrderResponse} from "../../datamodel/order";
import {IEvent} from "springtype/web/component/interface";


export interface OrderItemDeleteClickEvent extends IEvent<OrderItemDeleteClickEventDetail> {
}

export interface OrderItemDeleteClickEventDetail {
    item: OrderItem;
}


export interface IAttrOrderHeader {
    order: OrderResponse;
}

@component
export class OrderHeader extends st.component<IAttrOrderHeader> implements ILifecycle {

    @attr
    order: OrderResponse;

    render() {
        return <fragment>
            <div class="row">
                <h4 class={["header", 'col', 's12', 'm6','l8', 'offset-l2' ,'center']}>
                    Auftrag
                </h4>
                <table class={["striped", 'col', 's12', 'm6','l8', 'offset-l2']}>
                    <tbody>
                    <tr>
                        <td width="30%"><strong>Wohin:</strong></td>
                        <td width="70%">{this.order.shop_name}<br/>
                        </td>
                    </tr>
                    <tr>
                        <td width="30%"><strong>Datum:</strong></td>
                        <td width="70%">{this.order.created.substring(0, 10)}</td>
                    </tr>
                    <tr>
                        <td width="30%"><strong>Status:</strong></td>
                        <td width="70%"><span
                            class={["badge", getOrderStatusTextColorClass(this.order.status)]}>{getOrderStatusText(this.order.status)}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </fragment>
    }
}

