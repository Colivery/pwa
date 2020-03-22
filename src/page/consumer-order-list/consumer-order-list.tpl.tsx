import { ConsumerOrderListPage } from "./consumer-order-list";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { getOrderStatusText as getOrderStatusText } from "../../function/get-order-status-text";
import { getOrderStatusTextColorClass } from "../../function/get-order-status-text-color-class";

export default (component: ConsumerOrderListPage) => (
    <fragment>
        <NavHeader showBackButton={false} showAddButton={true} onAddButtonClick={component.onAddButtonClick} />

        <div class="container">
            <h5 class="header">Deine Aufträge</h5>

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
                    {component.displayData.length > 0 ? component.displayData.map((order: any) => <tr data-id={order.order_id} onClick={component.onRowClick}>
                        <td>{order.shop_name}</td>
                        <td>{order.products.length}</td>
                        <td class={[getOrderStatusTextColorClass(order.status)]}>{getOrderStatusText(order.status)}</td>
                        <td>{order.date}</td>
                        <td><a href="javascript:" class="btn grey">Anzeigen</a></td>
                    </tr>) : 'Noch kein Auftrag'}
                </tbody>
            </table>
        </div>

    </fragment>
)