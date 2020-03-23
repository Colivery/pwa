import "./order-item-row.scss"

import {tsx} from "springtype/web/vdom";
import {component} from "springtype/web/component";
import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";


@component({tag: 'div'})
export class OrderTable extends st.component implements ILifecycle {


    render() {
        return <fragment>
            <div class={['row']}>
                <h5 class={['col', 's12', 'center']}>
                    Artikel
                </h5>
            </div>
            <div class={['row']}>
                <div class={['col', 's3', 'l1', 'offset-l2', 'center']} style="border-bottom: solid 1px;">
                    <b>Status</b>
                </div>
                <div class={['col', 's6', 'l6']} style="border-bottom: solid 1px;">
                    <b>Beschreibung</b>
                </div>
                <div class={['col', 's3', 'l1', 'center']} style="border-bottom: solid 1px;">
                    <b>Löschen</b>
                </div>
            </div>
            {this.renderChildren()}
        </fragment>
    }

}

