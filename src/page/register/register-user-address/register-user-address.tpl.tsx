import {tsx} from "springtype/web/vdom";
import {MatInput} from "../../../component/mat/mat-input";
import {required} from "springtype/core/validate";
import {Form, Input} from "springtype/web/form";
import {RegisterUserAddressPage} from "./register-user-address";
import {MatTextarea} from "../../../component/mat/mat-textarea";
import {MatCheckbox} from "../../../component/mat/mat-checkbox";
import {LogoRow} from "../../../component/logo-row/logo-row";
import {ErrorMessage} from "../../../component/error-message/error-message";
import {OlMap} from "../../../component/ol-map/ol-map";

export default (component: RegisterUserAddressPage) => (
    <fragment>
        <div class="container">
            <Form ref={{formRef: component}}>
            <LogoRow/>
                <div class="row">
                    <MatInput name="name" label="Dein Name"
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                              helperText="z.B. Max Mustermann"
                              validators={[required]}
                              errorMessage={{
                                  required: 'Das ist ein Pflichtfeld'
                              }}>
                    </MatInput>
                    <MatInput name="phone" label="Telefonnummer"
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                              helperText="z.B. 0170 11 22 33 44"
                              validators={[required]}
                              errorMessage={{
                                  required: 'Das ist ein Pflichtfeld'
                              }}>
                    </MatInput>
                    <MatTextarea name="address" label="Wohn/Lieferadresse"
                                 class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                                 helperText="Wohin die Fahrer*in kommen soll"
                                 validators={[required, component.addressValidator]}
                                 errorMessage={{
                                     required: 'Das ist ein Pflichtfeld',
                                     address: 'Diese Adresse können wir nicht verstehen'
                                 }}>
                    </MatTextarea>
                    <Form name='geo_location'>
                        <Input ref={{latInputRef: component}} name="lat"  hidden={true}/>
                        <Input ref={{lngInputRef: component}} name="lng"  hidden={true}/>
                    </Form>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <OlMap ref={{olMapRef: component}} hideZoom={false}/>
                    </div>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <p>Für unsere Telefon-Hotline suchen wir tatkräftige Hilfe, denn viele Menschen rufen uns lieber an,
                            als Apps zu nutzen. Könntest Du Dir vorstellen, stundenweise auszuhelfen?
                        </p>
                    </div>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <MatCheckbox name="accepted_support_inquiry" label="Ja, ich biete meine Hilfe für die Telefon-Hotline an."/>
                    </div>
                </div>
                <div class="row">
                    <ErrorMessage ref={{errorMessage: component}}
                                  class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}/>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                       onClick={() => component.onNextClick()}>Weiter</a>
                </div>
            </Form>
        </div>
    </fragment>
)

export interface IRegisterUserAddressFormState {
    name: string;
    address: string;
    phone: string;
    accepted_support_inquiry: boolean;
    geo_location: {lat: string, lng: string}
}
