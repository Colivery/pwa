import {st} from "springtype/core";
import {inject} from "springtype/core/di";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {ref} from "springtype/core/ref";
import {AuthService} from "../../service/auth";
import {Form} from "springtype/web/form";
import "./register-user-address.scss";
import tpl, {IRegisterUserAddressForm} from "./register-user-address.tpl";
import {context} from "springtype/core/context";
import {getRegisterContext, IRegisterContext, REGISTER_CONTEXT} from "../../context/register";

@component({
    tpl
})
export class RegisterUserAddressPage extends st.component implements ILifecycle {
    static ROUTE = "register/user-address";


    @context(REGISTER_CONTEXT)
    context: IRegisterContext = getRegisterContext();

    @inject(AuthService)
    authService: AuthService;

    @ref
    formRef: Form;

    class = ['wrapper', 'valign-wrapper'];

    async onNextClick() {

        if (await this.formRef.validate()) {
            const data = this.formRef.getState() as any as IRegisterUserAddressForm;
            this.formRef.reset();
            this.context = {
                ...this.context,
                ...data
            }            ;
            st.debug('register user address data', data, this.context);
            st.route = {
                path: RegisterUserAddressPage.ROUTE
            };
        }

    }

}
