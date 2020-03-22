import { ConsumerOrderDetailPage } from "./consumer-order-detail";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatModal } from "../../component/mat/mat-modal";
import { getOrderStatusText } from "../../function/get-order-status-text";
import { getOrderStatusTextColorClass } from "../../function/get-order-status-text-color-class";
import {OlMap} from "../../component/ol-map/ol-map";

export default (component: ConsumerOrderDetailPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">

            <div class="row">
                <h4 class="header center">Auftrag</h4>
                <table class="striped">
                    <tbody>
                        <tr>
                            <td width="30%"><strong>Wo</strong></td>
                            <td width="70%">{component.orderContext.shop_name} <br />
                            <OlMap ref={{mapRef: component}} />
                            </td>
                        </tr>
                        <tr>
                            <td width="30%"><strong>Wann</strong></td>
                            <td width="70%">{component.orderContext.date}</td>
                        </tr>
                        <tr>
                            <td width="30%"><strong>Status</strong></td>
                            <td width="70%"><span class={["badge", getOrderStatusTextColorClass(component.orderContext.status)]}>{getOrderStatusText(component.orderContext.status)}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row">
                <h5 class="center">Dein Fahrer</h5>

                {component.orderContext.driver_user_id ?
                    <table class="striped">
                        <tbody>
                            <tr>
                                <td width="30%">Name</td>
                                <td width="70%">{component.driverContext.name}</td>
                            </tr>
                            <tr>
                                <td>Telefon</td>
                                <td><a href={`tel:${component.driverContext.phone}`}>{component.driverContext.phone}</a></td>
                            </tr>
                            <tr>
                                <td>E-Mail</td>
                                <td><a href={`mailto:${component.driverContext.email}`}>{component.driverContext.email}</a></td>
                            </tr>
                        </tbody>
                    </table> : 'Leider hat sich noch kein Fahrer für die Fahrt gemeldet.'}

            </div>

            <div class="row">

                <h5 class="center">Artikel</h5>

                <table class="striped highlight">
                    <tbody>
                        {component.orderContext.products.map((item: any) => <tr data-id={item.id}>
                            <td width="5%">{component.getStatusEmoji(item.status)}</td>
                            <td width="90%" class="truncate">{item.description}</td>
                            <td width="5%"><a class={["waves-effect", "btn-floating", "red", component.orderContext.status != 'to_be_delivered' ? 'disabled' : '']} href="javascript:" onClick={component.onDeleteButtonClick}>
                                <i class="material-icons">delete</i>
                            </a></td>
                        </tr>)}
                    </tbody>
                </table>
            </div>

            <div class="row">
                <h5 class="center">Hinweise</h5>

                <span>
                {component.orderContext.hint}
                </span>
            </div>

            {component.orderContext.status == 'to_be_delivered' ?
                <div class="card red darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Achtung</span>
                        <p>Du kannst diesen Auftrag noch abbrechen.</p>
                    </div>
                    <div class="card-action">
                        <a href="#">Auftrag abbrechen</a>
                    </div>
                </div> : <div class="card red darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Achtung</span>
                        <p>Dieser Auftrag kann nicht mehr abgebrochen werden.</p>
                    </div>
                </div>
            }
        </div>

        <MatModal ref={{ confirmDeleteItemModal: component }}>

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