import {tsx} from "springtype/web/vdom";
import {attr, component} from "springtype/web/component";
import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {IAttrOrderHeader} from "./order-header";
import {IUserProfileResponse} from "../../datamodel/user";

export interface IAttrOrderDriverStatus {
    user: IUserProfileResponse
}

@component({tag: 'div'})
export class OrderDriverStatus extends st.component<IAttrOrderHeader> implements ILifecycle {

    @attr
    user: IUserProfileResponse;

    render() {

        let driver;


        if (this.user) {
            driver = <table class={["striped", 'col', 's12', 'm6', 'l8', 'offset-l2']}>
                <tbody>
                <tr>
                    <td width="30%">Name</td>
                    <td width="70%">{this.user.name}</td>
                </tr>
                <tr>
                    <td>Telefon</td>
                    <td><a href={`tel:${this.user.phone}`}>{this.user.phone}</a>
                    </td>
                </tr>
                <tr>
                    <td>E-Mail</td>
                    <td><a href={`mailto:${this.user.email}`}>{this.user.email}</a>
                    </td>
                </tr>
                </tbody>
            </table>
        } else {
            driver = <div class={['col', 's12', 'm6','l8', 'offset-l2' ,'center']}>Leider hat sich noch kein Fahrer für die Fahrt gemeldet.</div>
        }
        return <fragment>
            <div class={['row']}>
                <h5 class={['col', 's12', 'm6','l8', 'offset-l2' ,'center']}>
                    Dein Fahrer
                </h5>
            </div>
            <div class={['row']}>
                {driver}
            </div>
        </fragment>
    }
}
