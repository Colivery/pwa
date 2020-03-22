import { DriverOrderDetailPage } from "./driver-order-detail";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatModal } from "../../component/mat/mat-modal";
import { getOrderStatusText } from "../../function/get-order-status-text";
import { getOrderStatusTextColorClass } from "../../function/get-order-status-text-color-class";
import { MatCheckbox } from "../../component/mat/mat-checkbox";

export default (component: DriverOrderDetailPage) => (
    <fragment>
        <NavHeader showBackButton={true} showAddButton={false} />

        <div class="container">

            <div class="row">
                <h4 class="header">Auftrag</h4>
                <table class="striped">
                    <tbody>
                        <tr>
                            <td width="30%"><strong>Wohin</strong></td>
                            <td width="70%">{component.orderContext.shop_name}<br />
                            </td>
                        </tr>
                        <tr>
                            <td width="30%"><strong>Wann</strong></td>
                            <td width="70%">{component.orderContext.created}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row">
                <h5 class="">Dein Auftraggeber</h5>

                <table class="striped">
                    <tbody>
                        <tr>
                            <td width="30%">Name</td>
                            <td width="70%">{component.customerContext.name}</td>
                        </tr>
                        <tr>
                            <td>Telefon</td>
                            <td><a href={`tel:${component.customerContext.phone}`}>{component.customerContext.phone}</a></td>
                        </tr>
                        <tr>
                            <td>E-Mail</td>
                            <td><a href={`mailto:${component.customerContext.email}`}>{component.customerContext.email}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row">

                <h5 class="">Deine Lieferadresse</h5>

                <table class="striped highlight">
                    <tbody>
                        {component.customerContext.address}
                    </tbody>
                </table>
            </div>

            <div class="row">

                <h5 class="">Artikel</h5>

                <table class="striped highlight">
                    <tbody>
                        {component.orderContext.items.map((item: any) => <tr data-id={item.id}>
                            <td width="5%">{component.getStatusEmoji(item.status)}</td>
                            <td width="90%" class="truncate">{item.description}</td>
                            <td width="5%">
                                <MatCheckbox name="done" label="Eingekauft" onChange={component.onCheckboxDoneChance} required={true} />
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>

            <div class="row">
                <h5 class="">Hinweise</h5>

                <span>
                    {component.orderContext.hint}
                </span>
            </div>

            {component.orderContext.status == 'to_be_delivered' ?
                <div class="card blue darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Achtung</span>
                        <p>Du kannst diesen Auftrag übernehmen. Sobald Du den Auftrag übernommen hast, erscheinen hier die genauen Kontaktdaten Deines Auftraggebers.</p>
                    </div>
                    <div class="card-action">
                        <a href="javascript:" onClick={component.onAcceptOrderClick}>Auftrag übernehmen</a>
                    </div>
                </div> : <div class="card red darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Achtung</span>
                        <p>Falls Du den Auftrag doch nicht erfüllen kannst, kannst Du ihn abgeben.</p>
                    </div>
                    <div class="card-action">
                        <a href="javascript:" onClick={component.onCancelOrderClick}>Auftrag abbrechen</a>
                    </div>
                </div>
            }
        </div>
    </fragment>
)