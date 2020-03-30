import {st} from "springtype/core";
import {component, state} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-detail.tpl";
import "./consumer-order-detail.scss";
import {MatModal} from "../../component/mat/mat-modal";
import {ref} from "springtype/core/ref";
import {OlMap} from "../../component/ol-map/ol-map";
import {inject} from "springtype/core/di";
import {OrderService} from "../../service/order";
import {OrderResponse} from "../../datamodel/order";
import {UserService} from "../../service/user";
import {IUserProfileResponse} from "../../datamodel/user";

@component({
    tpl
})
export class ConsumerOrderDetailPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-detail/:id";

    @inject(OrderService)
    orderService: OrderService;

    @inject(UserService)
    userService: UserService;

    @ref
    confirmDeleteItemModal: MatModal;

    @ref
    mapRef: OlMap;

    @state
    orderState: OrderResponse = null;

    @state
    driverUserState: IUserProfileResponse = null;

    async onRouteEnter() {
        console.log('st.route.params.id?', st.route.params.id);

        this.orderState = await this.orderService.getById(st.route.params.id as string);

        console.log('st.route.params.id', st.route.params.id);

        if (this.orderState.driver_user_id) {
            console.log('this.orderState.driver_user_id', this.orderState.driver_user_id);
            this.driverUserState = await this.userService.getUserProfile();
        }
    }
}
