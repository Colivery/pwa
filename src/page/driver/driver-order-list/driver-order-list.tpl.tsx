import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../../component/nav-header/nav-header";
import { getOrderStatusText as getOrderStatusText } from "../../../function/get-order-status-text";
import { getOrderStatusTextColorClass } from "../../../function/get-order-status-text-color-class";
import { DriverOrderList } from "./driver-order-list";
import { MatLoadingIndicator } from "../../../component/mat/mat-loading-indicator";

export default (component: DriverOrderList) => (
    <fragment>
        <NavHeader showBackButton={false} showAddButton={false} showRefreshButton={true} onRefreshButtonClick={component.onRefreshButtonClick} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">
            <h5 class="header"><i class="material-icons">time_to_leave</i> Offene Aufträge</h5>

            <p class="range-field">
                <h6>In welchem Umkreis möchtest Du gerne fahren?<span class="badge">{component.range} km</span></h6>
                <input type="range" min="1" max="50" value={component.range} onChange={component.onRangeChange} />
            </p>

            <table class="consumer-order-list striped highlight">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Artikel</th>
                        <th>Status</th>
                        <th>Route</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>

                {!component.isLoading ? <tbody>

                    {component.displayData.map((order: any) =>
                        <tr data-id={order.id}
                            onclick={component.onRowClick}>
                            <td>{order.shop_name}</td>
                            <td>{order.items.length}</td>
                            <td class={[getOrderStatusTextColorClass(order.status)]}>{getOrderStatusText(order.status)}</td>
                            <td>~{Math.round(parseInt(order.distance_km))} km</td>
                            <td><a href="javascript:" class="btn grey">Anzeigen</a></td>
                        </tr>)}

                </tbody> : <p>Bitte warten, Daten werden abgerufen...</p>}

                {component.displayData.length === 0 ? <p>Keine offene Auftrag</p> : ''}

            </table>
        </div>
    </fragment>
)