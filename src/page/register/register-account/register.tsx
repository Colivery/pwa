import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ref } from "springtype/core/ref";
import "./register.scss";
import tpl, { IRegisterFormState } from "./register.tpl";
import { RegisterUserAddressPage } from "../register-user-address/register-user-address";
import { ErrorMessage } from "../../../component/error-message/error-message";
import { tsx } from "springtype/web/vdom";
import { MatForm } from "st-materialize";

@component({
    tpl
})
export class RegisterPage extends st.component implements ILifecycle {
    static ROUTE = "register";

    @ref
    formRef: MatForm;

    @ref
    errorMessage: HTMLElement;

    @ref
    nextButton: HTMLElement;

    class = ['wrapper', 'valign-wrapper'];

    onBackClick() {
        history.back();
    }

    async onNextClick() {
        try {

            const data = this.formRef.getState() as any as IRegisterFormState;

            if (data.password !== data.password_again) {
                this.renderPartial(<ErrorMessage message={st.t("Passwords do not match")} class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />, this.errorMessage);
                return;
            } else {
                this.renderPartial('', this.errorMessage);
            }

            if (await this.formRef.validate(true)) {
                
                this.nextButton.classList.add('disabled');

                await window.authService.register(data.email, data.password);
                delete data.password;
                this.formRef.reset();

                st.route = {
                    path: RegisterUserAddressPage.ROUTE
                };
            }
        } catch (e) {

            this.renderPartial(<ErrorMessage message={e.message} class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />, this.errorMessage);
        }
    }
}
