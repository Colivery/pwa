import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput, MatTextArea, MatModal } from "st-materialize";
import { ModalMiddleContent } from "../../component/modal-middle-content/modal-middle-content";

export default (component: ConsumerOrderAddPage) => (
    <fragment>

        <NavHeader showBackButton={true} />

        <div class="container">

            <div class="row">
                <div class={['col', 's12', 'm6', 'l8', 'offset-l2', 'offset-m3']}>

                    {/**
                    <h5 class="header">Was brauchst Du?</h5>

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
 */}
                    {/*
                    <h5 class="header">Was brauchst Du?</h5>

                    <p>
                        Bitte Wähle zuerst die Art des Ladens, von dem Du etwas benötigst:
                    </p>

                    


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

                    <h5 class="header">Neuer Einkaufszettel</h5>

                    <p>Schreib uns, was Du brauchst, und ggf. woher, wieviel, und wie wichtig es Dir ist.</p>

                    <div ref={{ orderListContainer: component }}></div>

                    <div class="row">
                        <MatTextArea
                            name="description"
                            ref={{ articleDescription: component }}
                            label="Was brauchst Du?"
                            onKeyDown={component.articleDescriptionKeyDown}
                            class={['col', 's11']}>
                        </MatTextArea>

                        <div class="col s1">
                            <a class="btn-floating btn-small waves-effect waves-light red" style={{ left: '-20px', top: '25px' }} onClick={component.onOrderItemAddClick}><i class="material-icons">add</i></a>
                        </div>

                        <MatInput
                            name="maxPrice"
                            type="number"
                            ref={{ maxPriceField: component }}
                            label="Was darf es max. kosten? (€)"
                            class={['col', 's12']}>
                        </MatInput>
                    </div>

                    <h5 class="header" style={{ marginTop: 0, marginBottom: 0 }}>Hinweise</h5>

                    <div class="row">
                        <MatTextArea
                            ref={{ hintField: component }}
                            name="hint"
                            label="Woran muss die Fahrer*in denken?"
                            class={['col', 's12']}>
                        </MatTextArea>
                    </div>

                    <div class="card green darken-2">
                        <div class="card-content white-text">
                            <p>Bitte beachte, dass nachdem ein Fahrer Deinen Auftrag angenommen hat, Du ihn nicht mehr ändern kannst. Die Bezahlung erfolgt in bar.</p>
                        </div>
                    </div>

                    <div class="row">
                        <a href="javascript:" onClick={component.onCreateOrderButtonClick} class="btn col s12"><span class="material-align-middle"><i class="material-icons">done</i> Auftrag aufgeben</span></a>
                    </div>
                </div>
            </div>
        </div>

        <MatModal ref={{ confirmCreateOrderModal: component }}>

            <ModalMiddleContent>

                <h4 class={'center'}>Auftrag aufgeben</h4>

                Das wars schon. Du kannst den Auftrag jetzt einreichen. Aber hast Du auch geprüft, dass Du genug Bargeld zuhause hast, um die Fahrer*in zu bezahlen? Bist Du Dir sicher?

                <br /><br />
                p.s.: Wenn du deinen Auftrag abschickst, kann der Fahrer, der deinen Auftrag annimmt, deine Kontaktinformationen und Adresse sehen.
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.confirmCreateOrderModal.toggle()} class="modal-close waves-effect btn-footer-secondary waves-white btn material-align-middle"><i class="material-icons">highlight_off</i> &nbsp;Nein</a>
                <a href="javascript:" ref={{ addOrderButton: component }} onclick={component.onReallyCreateOrderClick} class="modal-close waves-effect waves-green btn success-button material-align-middle"><i class="material-icons">done_all</i>&nbsp;Ja</a>
            </template>
        </MatModal>

        <MatModal ref={{ warnAtLeastOneItemModal: component }}>
            <ModalMiddleContent>
                <h4 class={'center'}>Fehler</h4>

            Bitte schreib mindestens einen Artikel auf Deinen Einkaufszettel. Drücke anschließend den Plus (+)-Button.
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.warnAtLeastOneItemModal.toggle();
                }} class="modal-close waves-effect waves-green btn success-button">OK</a>
            </template>

        </MatModal >

    </fragment >
)