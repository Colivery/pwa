import "./register-user-address.scss";

import {st} from "springtype/core";
import {inject} from "springtype/core/di";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {ref} from "springtype/core/ref";
import {Form} from "springtype/web/form";
import tpl, {IRegisterUserAddressFormState} from "./register-user-address.tpl";
import {RegisterChooseProfile} from "../register-choose-profile/register-choose-profile";
import {RegisterService} from "../../../service/register";
import {ErrorMessage} from "../../../component/error-message/error-message";

@component({
    tpl
})
export class RegisterUserAddressPage extends st.component implements ILifecycle {
    static ROUTE = "register-user-address";

    @inject(RegisterService)
    registerService: RegisterService;

    @ref
    formRef: Form;

    @ref
    errorMessage: ErrorMessage;

    class = ['wrapper', 'valign-wrapper'];

    async onNextClick() {
        try {
            if (await this.formRef.validate()) {
                const data = this.formRef.getState() as any as IRegisterUserAddressFormState;
                this.formRef.reset();

                await this.registerService.createUserProfileComplete(data);

                st.debug('register user address data', data);
                st.route = {
                    path: RegisterChooseProfile.ROUTE
                };
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
    }

}
