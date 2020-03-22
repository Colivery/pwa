import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-list.tpl";
import "./consumer-order-list.scss";
import { ConsumerOrderDetailPage } from "../consumer-order-detail/consumer-order-detail";
import { context } from "springtype/core/context/context";
import { ORDER_CONTEXT, getOrderContext } from "../../context/order";
import { ConsumerOrderAddPage } from "../consumer-order-add/consumer-order-add";
import { ref } from "springtype/core/ref";
import { NavHeader } from "../../component/nav-header/nav-header";

@component({
    tpl
})
export class ConsumerOrderListPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-list";

    displayData = [];

    @context(ORDER_CONTEXT)
    orderContext: any = getOrderContext();

    onRouteEnter() {
        console.log('Route enter: TODO: Load from firebase');

        // mock: TODO: get data from firebase
        this.displayData = [{
            order_id: 'woEIqAywu7SkD3M6ijip',
            shop_name: 'Edeka Sabitz',
            products: [{
                id: 'asdasd8',
                description: "Brot",
                status: "todo"
            }],
            status: 'to_be_delivered',
            hint: 'Hintere Haustür',
            date: '2020-03-21'
        }, {
            order_id: 'woEIqAywu7SkD3M6ijip3',
            shop_name: 'Apotheke am Hart',
            driver_user_id: 'adasdasd323423',
            products: [{
                id: 'asdasd1',
                description: "Paracetamol 25mg",
                status: "todo"
            }, {
                id: 'asdasd2',
                description: "Fusicutan 200mg",
                status: "done"
            }],
            hint: 'Hintere Haustür',
            status: 'accepted',
            date: '2020-03-20'
        }, {
            order_id: 'woEIqAywu7SkD3M6ijip2',
            shop_name: 'Rossmann',
            hint: 'Hintere Haustür',
            products: [{
                id: 'asdasd3',
                description: "Shampoo",
                status: "todo"
            }, {
                id: 'asdasd4',
                description: "Honig",
                status: "todo"
            }],
            status: 'to_be_delivered',
            date: '2020-03-20'
        }];


        this.doRender();
    }

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    }

    onRowClick = (evt: MouseEvent) => {
        const id = ((evt.target as HTMLElement).closest('tr') as HTMLElement).getAttribute('data-id');

        for (let item of this.displayData) {
            if (item.order_id === id) {
                this.orderContext = item;
            }
        }

        st.route = {
            path: ConsumerOrderDetailPage.ROUTE,
            params: {
                id
            }
        }
    }
}
