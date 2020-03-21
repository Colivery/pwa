import { st } from "springtype/core";
import { inject } from "springtype/core/di";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ErrorMessage } from "../../component/error-message/error-message";
import { ref } from "springtype/core/ref";
import { AuthService } from "../../service/auth";
import tpl from "./consumer-order-list.tpl";
import "./consumer-order-list.scss";
import { Form } from "springtype/web/form";

@component({
    tpl
})
export class ConsumerOrderListPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-list";

    onAfterRender() {
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
            coverTrigger: false
        });
    }
}
