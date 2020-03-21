import {tsx} from "springtype/web/vdom";
import {MatInput} from "../../component/mat/mat-input";
import {email, minLength, required} from "springtype/core/validate";
import {Form} from "springtype/web/form";
import {RegisterPage} from "./register";
import {MatCheckbox} from "../../component/mat/mat-checkbox";

export default (component: RegisterPage) => (
    <fragment>
        <div class="container">
            <Form ref={{formRef: component}} class="col s12">
                <div class="row">
                    <MatInput name="email" label="Email"
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                              helperText="Enter your email "
                              validators={[required, email]}
                              successMessage={'right'}
                              errorMessage={{
                                  required: 'This field is required',
                                  'email': 'Not an valid email address'
                              }}>
                    </MatInput>
                    <MatInput name="password" label="Password" type="password"
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                              helperText="Enter here your password "
                              validators={[required, minLength(7)]}
                              successMessage={'right'}
                              errorMessage={{
                                  required: 'This field is required',
                                  'min-length': 'Minimum password length is 7'
                              }}>
                    </MatInput>
                </div>
                <div class="row">
                    <div class={[ 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <MatCheckbox name="acceptedTermOfUse" label="Terms" required={true}/>
                    </div>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <MatCheckbox name="acceptedPrivacyPolicy" label="AGB" required={true}/>
                    </div>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                       onClick={() => component.onNextClick()}>Next</a>
                </div>
            </Form>
        </div>
    </fragment>
)

export interface IRegisterForm {
    email: string;
    password: string,
    acceptedTermOfUse: boolean;
    acceptedPrivacyPolicy: boolean;
}
