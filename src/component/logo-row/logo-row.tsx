import {st} from "springtype/core";
import {component} from "springtype/web/component";
import {tsx} from "springtype/web/vdom";
import "./logo-row.scss";
import { Center } from "../center/center";

@component({tag: 'div'})
export class LogoRow extends st.component {

    class = ['logo-header', 'row'];

    render() {
        return<div class={['col', 's12']}>
            <Center><img src={require('../../../assets/images/logo.png')}/></Center>
        </div>
    }
}
