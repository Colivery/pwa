import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput, MatTextArea, MatModal } from "st-materialize";
import { ModalMiddleContent } from "../../component/modal-middle-content/modal-middle-content";
import { st } from "springtype/core";

export default (component: ConsumerOrderAddPage) => (
    <fragment>

        <NavHeader showBackButton={true} />

        <div class="container">

            <div class="row">
                <div class={['col', 's12', 'm6', 'l8', 'offset-l2', 'offset-m3']}>

                    {/**
                    <h5 class="header">{st.t("What do you need?")}</h5>

                    <div class="row">
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="supermarket" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🍎</p>
                                    <strong class="truncate">{st.t("Supermarket")}</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="drugstore" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🧻</p>
                                    <strong class="truncate">{st.t("Drugstore")}</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="beverages" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🥤</p>
                                    <strong class="truncate">{st.t("Beverage market")}</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="bakery" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🍞</p>
                                    <strong class="truncate">{st.t("Bakery")}</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="butcher" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">🥩</p>
                                    <strong class="truncate">{st.t("Butcher")}</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col s4">
                            <a href="javascript:" data-shop-type="pharmacy" onClick={component.activateShopType}>
                                <div class="shop-card">
                                    <p class="emoji-icon">💊</p>
                                    <strong class="truncate">{st.t("Pharmacy")}</strong>
                                </div>
                            </a>
                        </div>
                    </div>
 */}
                    {/*
                    <h5 class="header">{st.t("What do you need?")}</h5>

                    <p>
                        {st.t("Choose the type of store, where the items can be bought:")}
                    </p>

                    <strong>{st.t("Particular Store")}</strong>

                    <div class="row order-add-input-location">
                        <div class="col s2">
                            <img src={require('../../../assets/images/map_marker.png')} />
                        </div>
                        <MatInput
                            name="von"
                            ref={{ locationField: component }}
                            label={st.t("From:")}
                            value="&nbsp;"
                            validators={[minLength(3)]}
                            errorMessage={{
                                'min-length': {st.t("At least 3 characters")}
                            }}
                            class={['col', 's10']}
                            helperText={st.t("Type the name of the store here: i.e. Tesco"}
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
                                        <i class="material-icons">send</i> ~{Math.round(locationOption.distance * 1000)} {st.t("km")}
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
                            <i class="material-icons">send</i> ~{Math.round(component.selectedLocation.distance * 1000)} {st.t("km")}
                        </span><br /><br /></div> : ''}
                    */}

                    <h5 class="header">{st.t("New shopping list")}</h5>

                    <p>{st.t("Write down what you need. You can describe, how much, wich brand and what store you would like it from.")}</p>

                    <div ref={{ orderListContainer: component }}></div>

                    <div class="row">
                        <MatTextArea
                            name="description"
                            helperText={st.t("i. e. 300g organic tomatoes or 2L oatly oat milk")}
                            ref={{ articleDescription: component }}
                            label={st.t("What do you need?")}
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
                            label={st.t("What is the maximum cost of your purchase? (€)")}
                            class={['col', 's12']}>
                        </MatInput>
                    </div>

                    <h5 class="header" style={{ marginTop: 0, marginBottom: 0 }}>{st.t("Notes")}</h5>

                    <div class="row">
                        <MatTextArea
                            ref={{ hintField: component }}
                            name="hint"
                            helperText={st.t("i. e. Please call 5 minutes before arrival.")}
                            label={st.t("Is there anything else you would like to tell the driver?")}
                            class={['col', 's12']}>
                        </MatTextArea>
                    </div>

                    <div class="card green darken-2">
                        <div class="card-content white-text">
                            <p>{st.t("Note that you cannot change a request, after a driver has accepted your request. Payment is cash on delivery.")}</p>
                        </div>
                    </div>

                    <div class="row">
                        <a href="javascript:" onClick={component.onCreateOrderButtonClick} class="btn col s12"><span class="material-align-middle"><i class="material-icons">done</i> {st.t("Send Request")}</span></a>
                    </div>
                </div>
            </div>
        </div>

        <MatModal ref={{ confirmCreateOrderModal: component }}>

            <ModalMiddleContent>

                <h4 class={'center'}>{st.t("Send Request")}</h4>

                {st.t("Nearly finished! Only press \"yes\" if you have enough money to pay the driver on delivery.")}

                <br /><br />
                {st.t("Please Note: If a driver accepts your request, the driver will be able to view your contact information and address, to deliver the items.")}
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => component.confirmCreateOrderModal.toggle()} class="modal-close waves-effect btn-footer-secondary waves-white btn material-align-middle"><i class="material-icons">highlight_off</i> &nbsp;{st.t("No")}</a>
                <a href="javascript:" ref={{ addOrderButton: component }} onclick={component.onReallyCreateOrderClick} class="modal-close waves-effect waves-green btn success-button material-align-middle"><i class="material-icons">done_all</i>&nbsp;{st.t("Yes")}</a>
            </template>
        </MatModal>

        <MatModal ref={{ warnAtLeastOneItemModal: component }}>
            <ModalMiddleContent>
                <h4 class={'center'}>{st.t("Error")}</h4>

            {st.t("You have no items on your shopping list.")}
            </ModalMiddleContent>
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.warnAtLeastOneItemModal.toggle();
                }} class="modal-close waves-effect waves-green btn success-button">{st.t("OK")}</a>
            </template>

        </MatModal >

    </fragment >
)