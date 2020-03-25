import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput } from "../../component/mat/mat-input";
import { OlMap } from "../../component/ol-map/ol-map";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { MatTextarea } from "../../component/mat/mat-textarea";
import { MatModal } from "../../component/mat/mat-modal";
import { minLength } from "springtype/core/validate";

export default (component: ConsumerOrderAddPage) => (
    <fragment>
        <NavHeader showBackButton={true} showAddButton={false} />

        <div class="container">

            <div class="row">
                <div class={['col', 's12', 'm6', 'l8', 'offset-l2']}>

                    <h4 class="header">Was brauchst Du?</h4>

                    {component.isLoading ? <MatLoadingIndicator /> : ''}

                    <MatInput
                        name="von"
                        ref={{ locationField: component }}
                        label="Von"
                        validators={[minLength(3)]}
                        errorMessage={{
                            'min-length': 'Bitte mindestens 3 Zeichen'
                        }}
                        class={['col', 's12']}
                        helperText="Gib hier den Namen des Ladens ein, z.B. 'Edeka'"
                        onKeyUp={component.onLocationKeyUp}>
                    </MatInput>

                    {component.locationOptions.length ? <ul class="collection">

                        {component.locationOptions.map((locationOption, dataIndex) =>
                            <a href="javascript:" class="collection-item" data-index={dataIndex} onClick={component.onLocationOptionSelect}>
                                <div>
                                    {locationOption.name}<br />
                                    {locationOption.street} {locationOption.houseNumber}<br />
                                    {locationOption.postcode} {locationOption.city}
                                    <span class="secondary-content">
                                        <i class="material-icons">send</i> ~{Math.round(locationOption.distance * 1000)} km
                        </span>
                                </div>
                            </a>)}
                    </ul> : ''}

                    {component.isLoading ?
                        <div class="preloader-wrapper small active">
                            <div class="spinner-layer spinner-green-only">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div><div class="gap-patch">
                                    <div class="circle"></div>
                                </div><div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>
                        </div> : ''}

                    {component.selectedLocation ? <OlMap ref={{ olMapRef: component }} hideZoom={false} /> : ''}

                    {component.selectedLocation ? <div>
                        {component.selectedLocation.name}<br />
                        {component.selectedLocation.street} {component.selectedLocation.houseNumber}<br />
                        {component.selectedLocation.postcode} {component.selectedLocation.city}
                        <span class="secondary-content">
                            <i class="material-icons">send</i> ~{Math.round(component.selectedLocation.distance * 1000)} km
                        </span><br /><br /></div> : ''}

                    <div class="switch">
                        <label>
                            <input ref={{ dontCareForLocationSwitch: component }} onChange={component.onToggleDontCareForLocationSwitch} type="checkbox" />
                            <span class="lever"></span> Aber der Ort ist nicht so wichtig.
                </label>
                        <br />
                    </div>

                    <p>
                        Ich möchte ein Produkt aus folgender Kategorie:
            </p>

                    <div class="row">
                        <div class="col s12 m6 l4">
                            <label>
                                <input class="with-gap" name="shop_type" value="supermarket" type="radio"
                                    checked={component.selectedLocationType === 'supermarket'} />
                                <span>Supermarkt</span>
                            </label>
                        </div>
                        <div class="col s12 m6 l4">
                            <label>
                                <input class="with-gap" name="shop_type" value="butcher" type="radio"
                                    checked={component.selectedLocationType === 'butcher'} />
                                <span>Metzger</span>
                            </label>
                        </div>
                        <div class="col s12 m6 l4">
                            <label>
                                <input class="with-gap" name="shop_type" value="bakery" type="radio"
                                    checked={component.selectedLocationType === 'bakery'} />
                                <span>Bäckerei</span>
                            </label>
                        </div>
                        <div class="col s12 m6 l4">
                            <label>
                                <input class="with-gap" name="shop_type" value="cafe" type="radio"
                                    checked={component.selectedLocationType === 'cafe'} />
                                <span>Café</span>
                            </label>
                        </div>
                        <div class="col s12 m6 l4">
                            <label>
                                <input class="with-gap" name="shop_type" value="pharmacy" type="radio"
                                    checked={component.selectedLocationType === 'pharmacy'} />
                                <span>Apotheke</span>
                            </label>
                        </div>
                        <div class="col s12 m6 l4">
                            <label>
                                <input class="with-gap" name="shop_type" value="beverages" type="radio"
                                    checked={component.selectedLocationType === 'beverages'} />
                                <span>Getränkemarkt</span>
                            </label>
                        </div>
                    </div>

                    <h5 class="header">Einkaufszettel</h5>

                    <div>
                        {component.orderItems.length ? component.orderItems.map((orderItem, index) => <div data-index={index} class="row">
                            <div class="col s10">
                                {orderItem.description}
                            </div><div class="col s2">
                                <a class="btn-floating btn-large waves-effect waves-light red" onClick={component.onOrderItemRemoveClick}><i class="material-icons">remove</i></a>
                            </div></div>) : 'Noch keine Einträge.'}
                    </div>

                    <div class="row">
                        <div class="col s10">
                            <input ref={{ articleDescription: component }} />
                        </div>

                        <div class="col s2">
                            <a class="btn-floating btn-large waves-effect waves-light red" onClick={component.onOrderItemAddClick}><i class="material-icons">add</i></a>
                        </div>
                    </div>

                    <div class="row">
                        <MatInput
                            name="maxPrice"
                            ref={{ maxPriceField: component }}
                            label="Maximalbetrag in €"
                            class={['col', 's12']}
                            helperText="Alles zusammen darf maximal so viel kosten.">
                        </MatInput>
                    </div>

                    <h5 class="header">Lieferhinweise</h5>

                    <div class="row">

                        <MatTextarea
                            ref={{ hintField: component }}
                            name="hint"
                            label="Hinweise für die Fahrer*in"
                            class={['col', 's12']}
                            helperText="Was sollte die Fahrer*in noch wissen, damit alles klappt?">
                        </MatTextarea>
                    </div>

                    <div class="card green darken-2">
                        <div class="card-content white-text">
                            <span class="card-title">In Auftrag geben</span>
                            <p>Bitte beachte, dass nachdem ein Fahrer Deinen Auftrag angenommen hat, Du ihn nicht mehr ändern kannst.
                        Die Bezahlung erfolgt in bar.</p>
                        </div>
                        <div class="card-action right-align">
                            <a href="javascript:" onClick={component.onCreateOrderButtonClick}><i class="material-icons">done</i> Auftrag aufgeben</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <MatModal ref={{ confirmCreateOrderModal: component }}>

            <h4 class={'center'}>Auftrag aufgeben</h4>

            Hast Du geprüft, dass Du genug Bargeld zuhause hast? Bist Du Dir sicher?

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={component.onReallyCreateOrderClick} class="modal-close waves-effect waves-green btn-flat green-text darken-2"><i class="material-icons">done_all</i> Ja, Auftrag jetzt verbindlich aufgeben</a>
            </template>
        </MatModal>

        <MatModal ref={{ warnAtLeastOneItemModal: component }}>

            <h4 class={'center'}>Achtung</h4>

            Bitte schreib mindestens einen Artikel auf Deinen Einkaufszettel.

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.warnAtLeastOneItemModal.toggle();
                }} class="modal-close waves-effect waves-green btn-flat green-text darken-2">OK</a>
            </template>
        </MatModal>

    </fragment>
)