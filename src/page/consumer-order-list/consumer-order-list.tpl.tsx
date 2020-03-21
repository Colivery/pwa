import { ConsumerOrderListPage } from "./consumer-order-list";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";

export default (component: ConsumerOrderListPage) => (
    <fragment>
        <NavHeader showBackButton={false} showAddButton={true} onAddButtonClick={component.onAddButtonClick} />

        <div class="container">
            <h5>Was brauchst Du?</h5>

            <table class="consumer-order-list striped highlight responsive-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Artikel</th>
                        <th>Status</th>
                        <th>Wann?</th>
                    </tr>
                </thead>

                <tbody>
                    {component.displayData.length > 0 ? component.displayData.map((item: any) => <tr data-id={item.order_id} onClick={component.onRowClick}>
                        <td>{item.shop_name}</td>
                        <td>{item.products.length}</td>
                        <td>{item.status}</td>
                        <td>{item.date}</td>
                    </tr>) : 'Noch kein Auftrag'}
                </tbody>
            </table>
        </div>

    </fragment>
)