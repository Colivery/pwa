import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput } from "../../component/mat/mat-input";
import { OlMap } from "../../component/ol-map/ol-map";

export default (component: ConsumerOrderAddPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">
            <h4 class="header">Was brauchst Du?</h4>

            <MatInput 
                ref={{locationField: component}}
                label="Von"
                class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                helperText="Gib hier den Namen des Ladens ein"
                onKeyUp={component.onLocationKeyUp}>
            </MatInput>

            <OlMap latitude={component.pickupLat} longitude={component.pickupLon} />

        </div>

    </fragment>
)