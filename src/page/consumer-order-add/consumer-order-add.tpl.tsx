import { ConsumerOrderAddPage } from "./consumer-order-add";
import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";

export default (component: ConsumerOrderAddPage) => (
    <fragment>
        <NavHeader showAddButton={false} />

        <div class="container">
            <h4 class="header">Was brauchst Du?</h4>



        </div>

    </fragment>
)