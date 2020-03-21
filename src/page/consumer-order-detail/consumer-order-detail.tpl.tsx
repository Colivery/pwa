import { ConsumerOrderDetailPage } from "./consumer-order-detail";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatModal } from "../../component/mat/mat-modal";

export default (component: ConsumerOrderDetailPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">
            <h5>Auftrag <span class="badge"># {component.orderContext.order_id}</span></h5>

            <table class="striped">
                <tbody>
                    <tr>
                        <td>Wo</td>
                        <td>{component.orderContext.shop_name}</td>
                    </tr>
                    <tr>
                        <td>Wann</td>
                        <td>{component.orderContext.date}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td><span class={["badge", component.getBadgeColorForStatus(component.orderContext.status)]}>{component.getStatusText(component.orderContext.status)}</span></td>
                    </tr>
                    <tr>
                        <td>Hinweis</td>
                        <td>{component.orderContext.hint}</td>
                    </tr>
                </tbody>
            </table>

            <h5>Fahrer</h5>

            {component.orderContext.driver_user_id ?
                <table class="striped">
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{component.driverContext.name}</td>
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


            <h5>Artikel <span class="badge blue-text text-darken-2">{component.orderContext.products.length}</span></h5>

            <table class="striped highlight">

                <tbody>
                    {component.orderContext.products.map((item: any) => <tr data-id={item.id}>
                        <td>{component.getStatusEmoji(item.status)}</td>
                        <td>{item.description}</td>
                        <td><a class="waves-effect btn red" href="javascript:" onClick={component.onDeleteButtonClick}>
                            <i class="material-icons">delete</i>
                        </a></td>
                    </tr>)}
                </tbody>
            </table>
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