import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput } from "../../component/mat/mat-input";
import { OlMap } from "../../component/ol-map/ol-map";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";

export default (component: ConsumerOrderAddPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">
            <h4 class="header">Was brauchst Du?</h4>

            {component.isLoading ? <MatLoadingIndicator /> : ''}

            <MatInput
                ref={{ locationField: component }}
                label="Von"
                class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                helperText="Gib hier den Namen des Ladens ein"
                onKeyUp={component.onLocationKeyUp}>
            </MatInput>

            {component.locationOptions.length ? <ul class="collection">

                {component.locationOptions.map((locationOption, dataIndex) =>
                    <a href="javascript:" class="collection-item" data-index={dataIndex} onClick={component.onLocationOptionSelect}>
                        <div>
                            {locationOption.tags.name}<br />
                            {locationOption.tags['addr:street']} {locationOption.tags['addr:housenumber']}<br />
                            {locationOption.tags['addr:postcode']} {locationOption.tags['addr:city']}
                            <span class="secondary-content">
                                <i class="material-icons">send</i> ~{Math.round(locationOption.distance * 1000)} km
                        </span>
                        </div>
                    </a>)}
            </ul> : ''}

            <div class="row">
                <div class="col s6 m3 l2">
                    <label>
                        <input class="with-gap" name="shop_type" value="butcher" type="radio"
                            checked={component.selectedLocationType === 'butcher'} />
                        <span>Metzger</span>
                    </label>
                </div>
                <div class="col s6 m3 l2">
                    <label>
                        <input class="with-gap" name="shop_type" value="bakery" type="radio"
                            checked={component.selectedLocationType === 'bakery'} />
                        <span>Bäckerei</span>
                    </label>
                </div>
                <div class="col s6 m3 l2">
                    <label>
                        <input class="with-gap" name="shop_type" value="cafe" type="radio"
                            checked={component.selectedLocationType === 'cafe'} />
                        <span>Café</span>
                    </label>
                </div>
                <div class="col s6 m3 l2">
                    <label>
                        <input class="with-gap" name="shop_type" value="pharmacy" type="radio"
                            checked={component.selectedLocationType === 'pharmacy'} />
                        <span>Apotheke</span>
                    </label>
                </div>
                <div class="col s6 m3 l2">
                    <label>
                        <input class="with-gap" name="shop_type" value="supermarket" type="radio"
                            checked={component.selectedLocationType === 'supermarket'} />
                        <span>Supermarkt</span>
                    </label>
                </div>
                <div class="col s6 m3 l2">
                    <label>
                        <input class="with-gap" name="shop_type" value="beverages" type="radio"
                            checked={component.selectedLocationType === 'beverages'} />
                        <span>Getränkemarkt</span>
                    </label>
                </div>
            </div>

            <OlMap latitude={component.pickupLat} longitude={component.pickupLon} />

        </div>

    </fragment>
)