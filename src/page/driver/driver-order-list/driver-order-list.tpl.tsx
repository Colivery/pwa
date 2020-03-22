import {tsx} from "springtype/web/vdom";
import {NavHeader} from "../../../component/nav-header/nav-header";
import {getOrderStatusText as getOrderStatusText} from "../../../function/get-order-status-text";
import {getOrderStatusTextColorClass} from "../../../function/get-order-status-text-color-class";
import {DriverOrderList} from "./driver-order-list";

export default (component: DriverOrderList) => (
    <fragment>
        <NavHeader showBackButton={false} showAddButton={true} showRefreshButton={true} />

        <div class="container">
            <h5 class="header">Offene Aufträge</h5>

        <table class="consumer-order-list striped highlight responsive-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Artikel</th>
                <th>Status</th>
                <th>Wann?</th>
                <th>&nbsp;</th>
            </tr>
            </thead>

            <tbody>
            {component.displayData.length > 0 ? component.displayData.map((order: any) => <tr data-id={order.order_id}
                                                                                              onclick={component.onRowClick}>
                <td>{order.shop_name}</td>
                <td>{order.products.length}</td>
                <td class={[getOrderStatusTextColorClass(order.status)]}>{getOrderStatusText(order.status)}</td>
                <td>{order.date}</td>
                <td><a href="javascript:" class="btn grey">Anzeigen</a></td>
            </tr>) : 'Noch kein Auftrag'}
            </tbody>

        </table>
            <a               class="btn-floating btn-small waves-effect waves-light red pulse">
                <i class="material-icons">refresh</i>
            </a>
        </div>
    </fragment>
)