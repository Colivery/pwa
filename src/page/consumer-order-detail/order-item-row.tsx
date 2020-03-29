import "./order-item-row.scss"

import {tsx} from "springtype/web/vdom";
import {attr, component, event} from "springtype/web/component";
import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {OrderItem} from "../../datamodel/order";
import {OrderItemStatus} from "../../types/order-item-status";
import {IEvent, IEventListener} from "springtype/web/component/interface";

export interface OrderItemDeleteClickEvent extends IEvent<OrderItemDeleteClickEventDetail> {
}

export interface OrderItemDeleteClickEventDetail {
    item: OrderItem;
}

export interface IAttrOrderItemRow {
    item: OrderItem;
    delivery?: boolean;
    onOrderItemDeleteClick?: (evt: OrderItemDeleteClickEvent) => void
}

@component
export class OrderItemRow extends st.component<IAttrOrderItemRow> implements ILifecycle {

    @attr
    item: OrderItem;

    @attr
    delivery: boolean = false;

    @event
    onOrderItemDeleteClick!: IEventListener<Event>;

    dispatchOrderItemDelete = (detail: OrderItemDeleteClickEventDetail) => {

        this.dispatchEvent<OrderItemDeleteClickEventDetail>("orderItemDeleteClick", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                ...detail,
            },
        });
    };

    render() {
        return <div class={['row', 'order-item']}>
            <div class={['col', 's3', 'l1', 'offset-l2', 'center']}>
                {this.getStatusEmoji(this.item.status)}
            </div>
            <div class={['col', 's6', 'l6', 'truncate']}>{this.item.description}</div>
            <div class={['col', 's3', 'l1', 'center']}>
                <a class={["waves-effect", "btn-floating", "btn-small", "red", this.delivery ? 'disabled' : '']}
                   href="javascript:" onClick={this.onDeleteButtonClick}>
                    <i class="material-icons">delete</i>
                </a>

            </div>
        </div>
    }

    onDeleteButtonClick = () => {
        this.dispatchOrderItemDelete({item: this.item});
    };

    getStatusEmoji = (status: OrderItemStatus) => {
        switch (status) {
            case "todo":
                return "⏳";
            case "done":
                return "✅";
        }
    }
}

