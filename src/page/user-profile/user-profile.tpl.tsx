import {tsx} from "springtype/web/vdom";
import {NavHeader} from "../../component/nav-header/nav-header";
import {UserProfile} from "./user-profile";
import {Form} from "springtype/web/form";
import {MatInput} from "../../component/mat/mat-input";
import {email, required} from "springtype/core/validate";
import {MatTextarea} from "../../component/mat/mat-textarea";
import {MatCheckbox} from "../../component/mat/mat-checkbox";
import {ErrorMessage} from "../../component/error-message/error-message";
import {OlMap} from "../../component/ol-map/ol-map";

export default (component: UserProfile) => (
    <fragment>
        <NavHeader showBackButton={true} onAddButtonClick={component.onAddButtonClick}/>
        <div class="container">
            <div class="row">
                <div class={['col', 's12']}>
                    <center>
                        <h5>User Profile</h5>
                    </center>
                </div>
                <Form ref={{formRef: component}}>
                    {getFormInputs(component)}
                </Form>
            </div>
            <div class="row">
                <ErrorMessage ref={{errorMessage: component}}
                              class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}/>
            </div>
            <div class="row">
                <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                   onClick={component.updateUserProfile}>update</a>
            </div>
        </div>
    </fragment>
)

const getFormInputs = (component: UserProfile) => {
    if (component.state) {
        return <fragment>
            <MatInput name="id" label="Id"
                      class={['col', 's12', 'm6']}
                      helperText="Your user Id"
                      disabled={true}
                      value={component.userId}
            />
            <MatInput name="email" label="Email"
                      class={['col', 's12', 'm6']}
                      helperText="Enter your email "
                      validators={[required, email]}
                      successMessage={'right'}
                      value={component.state.email}
                      errorMessage={{
                          required: 'This field is required',
                          'email': 'Not an valid email address'
                      }}>
            </MatInput>
            <MatInput name="name" label="Name"
                      class={['col', 's12', 'm6']}
                      helperText="Enter your full name here"
                      validators={[required]}
                      successMessage={'right'}
                      value={component.state.name}
                      errorMessage={{
                          required: 'This field is required'
                      }}>
            </MatInput>
            <MatInput name="phone" label="Phone"
                      class={['col', 's12', 'm6']}
                      helperText="Enter your phone number here"
                      validators={[required]}
                      successMessage={'right'}
                      value={component.state.phone}
                      errorMessage={{
                          required: 'This field is required'
                      }}>
            </MatInput>
            <MatTextarea ref={{addressRef: component}} name="address" label="Address"
                         class={['col', 's12', 'm6']}
                         helperText="Enter your full address here"
                         validators={[required]}
                         successMessage={'right'}
                         value={component.state.address}
                         errorMessage={{
                             required: 'This field is required'
                         }}>
            </MatTextarea>
            <OlMap ref={{mapRef:component}}/>
            <div class={['col', 's12', 'm6']} >
                <MatCheckbox checked={component.state.accepted_support_inquiry} ref={{supportInquiryRef: component}}  name="accepted_support_inquiry" label="Accept support inquiry"/>
            </div>
        </fragment>
    }
    return <fragment/>
};
