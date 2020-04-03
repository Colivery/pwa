import "./register-choose-profile.scss";

import {st} from "springtype/core";
import {inject} from "springtype/core/di";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./register-choose-profile.tpl";
import {PreferenceService} from "../../../service/preference";
import {Profile} from "../../../datamodel/profile";

@component({
    tpl
})
export class RegisterChooseProfile extends st.component implements ILifecycle {
    static ROUTE = "register-choose-profile";

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    class = ['wrapper', 'valign-wrapper'];

    async onNextClick(profile: Profile) {
        this.preferenceService.setProfile(profile);
        st.route = {
            path: profile + '-order-list'
        };
    }
}
