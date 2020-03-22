import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { MatInput } from "../../component/mat/mat-input";

export default (component: ConsumerOrderAddPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">
            <h4 class="header">Was brauchst Du?</h4>

            <MatInput 
                ref={{locationField: component}}
                label="Woher?"
                class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                helperText="Gib hier den Namen des Ladens ein"
                onKeyUp={component.onLocationKeyUp}>
            </MatInput>

        </div>

    </fragment>
)