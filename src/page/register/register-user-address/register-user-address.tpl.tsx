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
                    <MatInput name="name" label="Name"
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                              helperText="Enter your full name here"
                              validators={[required]}
                              successMessage={'right'}
                              errorMessage={{
                                  required: 'This field is required'
                              }}>
                    </MatInput>
                    <MatInput name="phone" label="Phone"
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                              helperText="Enter your phone number here"
                              validators={[required]}
                              successMessage={'right'}
                              errorMessage={{
                                  required: 'This field is required'
                              }}>
                    </MatInput>
                    <MatTextarea name="address" label="Address"
                                 class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                                 helperText="Enter your full address here"
                                 validators={[required, component.addressValidator]}
                                 successMessage={'right'}
                                 errorMessage={{
                                     required: 'This field is required',
                                     address: 'Invalid address'
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
                        <p>Since there are a lot of old people in this country who are not so afine with computers,
                            people will need you to answer the phone calls. </p>
                    </div>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <MatCheckbox name="accepted_support_inquiry" label="Accept support inquiry"/>
                    </div>
                </div>
                <div class="row">
                    <ErrorMessage ref={{errorMessage: component}}
                                  class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}/>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                       onClick={() => component.onNextClick()}>Next</a>
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
