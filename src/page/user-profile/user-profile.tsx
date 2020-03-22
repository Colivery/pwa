import "./user-profile.scss";

import {st} from "springtype/core";
import {component, state} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./user-profile.tpl";
import {ConsumerOrderAddPage} from "../consumer-order-add/consumer-order-add";
import {inject} from "springtype/core/di";
import {RegisterService} from "../../service/register";
import {IUserProfile} from "../../datamodel/user";
import {ref} from "springtype/core/ref";
import {Form} from "springtype/web/form";
import {ErrorMessage} from "../../component/error-message/error-message";

@component({
    tpl
})
export class UserProfile extends st.component implements ILifecycle {

    static ROUTE = "user-profile";

    @inject(RegisterService)
    registerService: RegisterService;

    @ref
    formRef: Form;


    @ref
    errorMessage: ErrorMessage;

    @state
    state: IUserProfile;

    userId!: string;

    constructor() {
        super();
        this.loadData()
    }


    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    };
    updateUserProfile = async () => {
        try{

        if (this.formRef.validate()) {
            const formState = this.formRef.getState() as any;
            st.debug('userProfile', formState);

            delete formState.id;
            await this.registerService.updateProfile(formState   as IUserProfile);
        }
        }catch(e){
            this.errorMessage.message = e.message;
        }
    };

    private async loadData() {
        this.userId = this.registerService.getUserId();
        this.state = await this.registerService.getUserProfile();
        console.log('profile',);
    }
}
