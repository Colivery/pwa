import {st} from "springtype/core";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {ref} from "springtype/core/ref";
import {Form} from "springtype/web/form";
import "./register.scss";
import tpl, {IRegisterFormState} from "./register.tpl";
import {RegisterUserAddressPage} from "../register-user-address/register-user-address";
import {ErrorMessage} from "../../component/error-message/error-message";
import {inject} from "springtype/core/di";
import {RegisterService} from "../../../service/register";

@component({
    tpl
})
export class RegisterPage extends st.component implements ILifecycle {
    static ROUTE = "register";

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
                const data = this.formRef.getState() as any as IRegisterFormState;
                const userCredential = await window.authService.register(data.email, data.password);
                delete data.password;
                await this.registerService.createUserProfile(userCredential.user.uid, data);
                this.formRef.reset();

                st.debug('register data', data);

                st.route = {
                    path: RegisterUserAddressPage.ROUTE
                };
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }

    }

}
