import {tsx} from "springtype/web/vdom";
import {attr, component} from "springtype/web/component";
import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
export interface IAttrOderStatusCard {
    toBeDelivered: boolean;
}
@component({tag: 'div'})
export class OderStatusCard extends st.component<IAttrOderStatusCard> implements ILifecycle {

    @attr
    toBeDelivered: boolean;

    class=['row', 'center'];

    render() {
        if (this.toBeDelivered) {
            return <div class="col s12 m6 offset-m3 card red darken-2 waves-effect">
                <div class="card-content white-text">
                <span class="card-title">
                    <span class="material-icons">report_problem</span>
                    &nbsp;Achtung&nbsp;
                    <span class="material-icons">report_problem</span>
                    </span>
                    <p>Du kannst diesen Auftrag noch abbrechen.</p>
                    <br/>
                    <b>Auftrag abbrechen</b>
                </div>
            </div>
        }
        return <div class="col s12 m6 offset-m3 card red darken-2">
            <div class="card-content white-text">
                <span class="material-icons">report</span>
                &nbsp;Achtung&nbsp;
                <span class="material-icons">report</span>
                <p>Dieser Auftrag kann nicht mehr abgebrochen werden.</p>
            </div>
        </div>
    }

}
