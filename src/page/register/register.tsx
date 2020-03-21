import {st} from "springtype/core";
import {inject} from "springtype/core/di";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {ref} from "springtype/core/ref";
import {AuthService} from "../../service/auth";
import {Form} from "springtype/web/form";
import "./register.scss";
import tpl, {IRegisterForm} from "./register.tpl";
import {context} from "springtype/core/context";
import {getRegisterContext, IRegisterContext, REGISTER_CONTEXT} from "../../context/register";
import {RegisterUserAddressPage} from "../register-user-address/register-user-address";

@component({
    tpl
})
export class RegisterPage extends st.component implements ILifecycle {
    static ROUTE = "register";


    @context(REGISTER_CONTEXT)
    context: IRegisterContext = getRegisterContext();


    @inject(AuthService)
    authService: AuthService;

    @ref
    formRef: Form;

    class = ['wrapper', 'valign-wrapper'];

    async onNextClick() {

        if (await this.formRef.validate()) {
            const data = this.formRef.getState() as any as IRegisterForm;
            this.formRef.reset();

            st.debug('register data', data);

            this.context = {...this.context, ...data};

            st.route = {
                path: RegisterUserAddressPage.ROUTE
            };
        }

    }

}
