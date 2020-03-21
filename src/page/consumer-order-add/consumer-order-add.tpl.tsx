import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";

export default (component: ConsumerOrderAddPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">
            <h5>Was brauchst Du?</h5>


        </div>

    </fragment>
)