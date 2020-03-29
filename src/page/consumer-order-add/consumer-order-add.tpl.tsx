import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput } from "../../component/mat/mat-input";
import { MatTextarea } from "../../component/mat/mat-textarea";
import { MatModal } from "../../component/mat/mat-modal";

export default (component: ConsumerOrderAddPage) => (
    <fragment>

        <NavHeader showBackButton={true} showAddButton={false} />

        <div class="container">

            <div class="row">
                <div class={['col', 's12', 'm6', 'l8', 'offset-l2', 'offset-m3']}>

                    {/*
                    <h5 class="header">Was brauchst Du?</h5>

                    <p>
                        Bitte Wähle zuerst die Art des Ladens, von dem Du etwas benötigst:
                    </p>

                    <strong>Laden</strong>

                    <div class="row">
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="supermarket" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🍎</p>
                                    <strong class="truncate">Supermarkt</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="drugstore" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🧻</p>
                                    <strong class="truncate">Drogerie</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="beverages" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🥤</p>
                                    <strong class="truncate">Getränke</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="bakery" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🍞</p>
                                    <strong class="truncate">Bäckerei</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="butcher" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🥩</p>
                                    <strong class="truncate">Metzgerei</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="pharmacy" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">💊</p>
                                    <strong class="truncate">Apotheke</strong>
                                </div>
                            </a>
                        </div>
                    </div>


                    <strong>Bestimmter Laden</strong>

                    <div class="row order-add-input-location">
                        <div class="col s2">
                            <img src={require('../../../assets/images/map_marker.png')} />
                        </div>
                        <MatInput
                            name="von"
                            ref={{ locationField: component }}
                            label="Und zwar von:"
                            value="&nbsp;"
                            validators={[minLength(3)]}
                            errorMessage={{
                                'min-length': 'Bitte mindestens 3 Zeichen'
                            }}
                            class={['col', 's10']}
                            helperText="Gib hier den Namen des Ladens ein, z.B. Edeka"
                            onKeyUp={component.onLocationKeyUp}>
                        </MatInput>
                    </div>

                    <MatLoadingIndicator class="hide" ref={{ loadingIndicator: component }} />

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

                    {component.selectedLocation ? <EsriMap ref={{ olMapRef: component }} /> : ''}

                    {component.selectedLocation ? <div>
                        {component.selectedLocation.name}<br />
                        {component.selectedLocation.street} {component.selectedLocation.houseNumber}<br />
                        {component.selectedLocation.postcode} {component.selectedLocation.city}
                        <span class="secondary-content">
                            <i class="material-icons">send</i> ~{Math.round(component.selectedLocation.distance * 1000)} km
                        </span><br /><br /></div> : ''}
                    */}

                    <h5 class="header">Mein Einkaufszettel</h5>

                    <div ref={{ orderListContainer: component }}></div>

                    <div class="row">
                        <div class="col s10">
                            <input ref={{ articleDescription: component }} />
                        </div>

                        <div class="col s2">
                            <a class="btn-floating btn-small waves-effect waves-light red" onClick={component.onOrderItemAddClick}><i class="material-icons">add</i></a>
                        </div>
                    </div>

                    <div class="row">
                        <MatInput
                            name="maxPrice"
                            ref={{ maxPriceField: component }}
                            label="Was darf es max. kosten? (€)"
                            class={['col', 's12']}>
                        </MatInput>
                    </div>

                    <h5 class="header" style={{ marginTop: 0 }}>Meine Lieferhinweise</h5>

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